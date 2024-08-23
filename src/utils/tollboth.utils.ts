import { PointType } from '../types/point.type';
import { getDataByCol, isPointInBounds } from './geoUtils';
import __switch_ from './switch';
import redisModel from '../models/redis.model';
import { getConnection } from '../dbs/init.mysql';
import { v4 as uuidv4 } from 'uuid';
import DatabaseModel from '../models/database.model';
import { saveTable } from './table/saveTable';
import { tables } from '../constants/tableName.constant';
import { tableExists } from './table/checkTableExists';
import { PoolConnection } from 'mysql2';

const dataBaseModel = new DatabaseModel();

let process: string[] = [];

let cachedResults: any = null;

let con: PoolConnection;

const tollboth = {
    insertReport: async (
        car: any,
        point: PointType,
        tm: number,
        highwayName: string,
    ) => {
        try {
            process.push(car.dev_id);
            // create query
            const query = `('${car.dev_id}', ${point[0]}, ${
                point[1]
            }, ${tm}, '${car.dri}', '${highwayName}', ${Date.now()})`;

            // create report key
            const reportKey = `report:${car.dev_id}:${car.ref_id}:${tm}`;

            // check if the car has been reported in the last 5 minutes
            const keys = await redisModel.hGetAll(
                'report',
                'tollboth.utils.ts',
                uuidv4(),
            );

            const recentReportKeys = Object.keys(keys.data).filter((key) =>
                key.startsWith(`report:${car.dev_id}:${car.ref_id}`),
            );

            const reportTimes = recentReportKeys.map((key) =>
                Number(key.split(':')[3]),
            );
            const latestReportTime = Math.max(...reportTimes);

            if (latestReportTime && Math.abs(tm - latestReportTime) <= 300)
                return;

            const tableName: any = await tollboth.getTableName(car.dev_id);
            const isExist = await tableExists(con, tableName);
            if (!isExist) {
                await redisModel.hSet(
                    'report',
                    reportKey,
                    query,
                    'tollboth.utils.ts',
                    uuidv4(),
                );
                tollboth.logReport(car, highwayName, point);
                return;
            }

            const reports: any = await tollboth.getReportByImeiAndName(
                car.dev_id,
                highwayName,
            );

            if (reports.length > 0) {
                const reportTime = reports[0].start_time;
                if (reportTime && Math.abs(tm - reportTime) <= 300) return;
            }
            // ----------------------------

            // save report to redis
            await redisModel.hSet(
                'report',
                reportKey,
                query,
                'tollboth.utils.ts',
                uuidv4(),
            );

            tollboth.logReport(car, highwayName, point);
        } catch (error) {
            console.log(error);
        }
    },

    initData: async () => {
        const { conn } = await getConnection();

        con = conn;

        if (!cachedResults) {
            console.time('Loading data');

            const tollboths = getDataByCol('tollboths');

            let netKeys = {};
            let data = {};

            const processItems = (items: any) => {
                items
                    .filter((item: any) => item.isDelete !== 1)
                    .forEach((item: any) => {
                        Object.assign(netKeys, item.keyData);
                        Object.assign(data, item.hData);
                    });
            };

            processItems(tollboths);

            console.timeEnd('Loading data');

            cachedResults = { netKeys, data };

            return cachedResults;
        } else if (cachedResults) {
            return cachedResults;
        }
    },

    sendReport: () => {
        setInterval(async () => {
            try {
                const keys = await redisModel.hGetAll(
                    'report',
                    'tollboth.utils.ts',
                    uuidv4(),
                );

                if (keys.data && Object.keys(keys.data).length > 0) {
                    var queries: { [key: string]: string } = {};

                    for (const key of Object.keys(keys.data)) {
                        const imei = key.split(':')[1];
                        const tableName = await tollboth.getTableName(imei);

                        const __key_ = `INSERT INTO ${tableName} (imei, lat, lng, start_time, dri, tollboth_name, create_at) VALUES `;

                        if (!queries[__key_]) {
                            queries[__key_] = `${keys.data[key]},`;
                        } else {
                            queries[__key_] += `${keys.data[key]},`;
                        }
                    }

                    Object.keys(queries).forEach(async (key) => {
                        queries[key] = queries[key].slice(0, -1);

                        con.query(key + queries[key], async (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                Object.keys(keys.data).forEach(async (key) => {
                                    await redisModel.hDel(
                                        'report',
                                        key,
                                        'tollboth.utils.ts',
                                        uuidv4(),
                                    );
                                });
                            }
                        });
                    });

                    console.log(
                        `Đã gửi ${Object.keys(keys.data).length} báo cáo`,
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }, 10000);
    },

    report: (cars: { [key: string]: any }, tollboths: any, data: any) => {
        try {
            if (!data || !tollboth.isValidData(data)) return;

            const {
                tm,
                driJn: dri,
                resync,
                vid,
                id,
                mlat,
                mlng,
                sp,
                state,
            } = tollboth.isValidData(data);

            const point: PointType = [Number(mlat), Number(mlng)];

            const key = __switch_.getKeyFloor2(point)?.key;

            var netKeys = tollboths.netKeys;
            var data = tollboths.data;

            const boundList = netKeys?.[key] || [];

            for (let wayId of boundList) {
                const way = data?.[wayId];
                const ref_id = Number(way?.id.split('-')[0]);
                const key: string = `${vid}-${resync}`;

                const inBounds = isPointInBounds(point, way?.buffer_geometry);

                if (!cars[key]) {
                    const car = {
                        ref_id,
                        vid: vid,
                        dev_id: id,
                        resync: resync,
                        dri: dri,
                        state: inBounds,
                        highway_name: way?.name,

                        isStopChecked: true,
                    };
                    if (inBounds && process.indexOf(car.dev_id) === -1) {
                        tollboth.insertReport(car, point, tm, way?.name);
                        cars[key] = car;
                        process.splice(process.indexOf(car.dev_id), 1);
                    } else if (!inBounds) {
                        cars[key] = car;
                    }
                } else {
                    const car = cars[key];

                    const isInWarning = !car.state && inBounds;
                    const isOutWarning = car.state && !inBounds;

                    if (isInWarning && process.indexOf(car.dev_id) === -1) {
                        tollboth.insertReport(car, point, tm, way?.name);
                        process.splice(process.indexOf(car.dev_id), 1);
                    } else if (isOutWarning) {
                        console.log(
                            `Xe ${car.dev_id} đi ra ${car.highway_name} ${
                                point[0]
                            } ${point[1]} ${
                                car.resync === '1' ? 'resync' : ''
                            }`,
                        );
                    }

                    car.state = inBounds;
                    car.isStopChecked =
                        state?.toString() !== '3' && Number(sp) <= 0;
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    getReportByImeiAndName: async (imei: string, name: string) => {
        try {
            const tableName: any = await tollboth.getTableName(imei);

            const result = await dataBaseModel.select(
                con,
                tableName,
                '*',
                'imei = ? AND tollboth_name = ?',
                [imei, name],
                'start_time',
                'DESC',
            );

            return result;
        } catch (error) {
            throw error;
        }
    },

    getTableName: async (imei: string) => {
        const result: any = await dataBaseModel.select(
            con,
            tables.tableDevice,
            'id',
            'imei = ?',
            [imei],
        );

        if (!result[0]?.id) throw new Error("Device doesn't exist");

        const tableName = await saveTable(con, result[0]?.id);

        return tableName;
    },

    isValidData: (data: any) => {
        const { tm, resync, vid, id, mlat, mlng, sp, state } = data[0];
        if (!tm || !resync || !vid || !id || !mlat || !mlng || !sp || !state) {
            return null;
        }

        return data[0];
    },
    logReport: (car: any, highwayName: string, point: PointType) => {
        console.log(
            `Xe ${car.dev_id} đi vào ${highwayName} ${point[0]}, ${point[1]} ${
                car.resync === '1' ? 'resync' : ''
            }`,
        );
        car.highway_name = highwayName;
    },
};

export default tollboth;
