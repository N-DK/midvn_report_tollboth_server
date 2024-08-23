import { PoolConnection } from 'mysql2';
import DatabaseModel from './database.model';

class ReportModel extends DatabaseModel {
    constructor() {
        super();
    }

    async getReport(con: PoolConnection, query: any) {
        let { offset, limit, imei, start_date, end_date } = query;

        offset = parseInt(offset, 10) || 0;
        limit = parseInt(limit, 10) || 99999999;

        // kiểm tra start_date và end_date có cùng tháng không
        const start = new Date(start_date * 1000);
        const end = new Date(end_date * 1000);

        const isSameMonth = start.getMonth() === end.getMonth();

        const data: any = await new Promise((resolve, rejects) => {
            try {
                con.query(
                    `CALL call_merge_imei_data_procedures('${imei}', ${start_date}, ${end_date})`,
                    (err, result) => {
                        if (err) {
                            rejects(err);
                        }
                        resolve(result);
                    },
                );
            } catch (error) {
                rejects(error);
            }
        });

        const dataPage = isSameMonth
            ? data[0]
            : Array.isArray(data[1])
            ? [...data[0], ...data[1]]
            : data[0];

        const totalRecord = dataPage.length;
        const totalPage = Math.ceil(totalRecord / limit);

        const results = dataPage.map((item: any) => {
            const { fee, ...rest } = item;

            return rest;
        });

        return { data: results, totalPage, totalRecord };
    }

    async getReportWithFee(con: PoolConnection, query: any) {
        let { offset, limit, imei, start_date, end_date } = query;
        offset = parseInt(offset, 10) || 0;
        limit = parseInt(limit, 10) || 9999999;

        const start = new Date(start_date * 1000);
        const end = new Date(end_date * 1000);

        const isSameMonth = start.getMonth() === end.getMonth();

        try {
            const data: any = await new Promise((resolve, rejects) => {
                try {
                    con.query(
                        `CALL call_merge_imei_data_procedures('${imei}', ${start_date}, ${end_date})`,
                        (err, result) => {
                            if (err) {
                                rejects(err);
                            }
                            resolve(result);
                        },
                    );
                } catch (error) {
                    rejects(error);
                }
            });

            const dataPage = isSameMonth
                ? data[0]
                : Array.isArray(data[1])
                ? [...data[0], ...data[1]]
                : data[0];

            const totalRecord = dataPage.length;
            const totalPage = Math.ceil(totalRecord / limit);

            return {
                data: dataPage.slice(offset, offset + limit),
                totalPage,
                totalRecord,
            };
        } catch (error: any) {
            throw new Error(`Error fetching report data: ${error.message}`);
        }
    }
}

export default new ReportModel();
