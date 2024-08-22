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
        const data: any = await new Promise((resolve, rejects) => {
            try {
                con.query(
                    `CALL merge_imei_data('${imei}', ${start_date}, ${end_date})`,
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

        const totalPage = 0;
        const totalRecord = data[0].length;

        const results = data[0].map((item: any) => {
            const { fee, ...rest } = item;

            return rest;
        });

        return { data: results, totalPage, totalRecord };
    }

    async getReportWithFee(con: PoolConnection, query: any) {
        let { offset, limit, imei, start_date, end_date } = query;
        offset = parseInt(offset, 10) || 0;
        limit = parseInt(limit, 10) || 9999999;
        // call function to get report
        const data: any = await new Promise((resolve, rejects) => {
            try {
                con.query(
                    `CALL merge_imei_data('${imei}', ${start_date}, ${end_date})`,
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
        const totalPage = 0;
        const totalRecord = data[0].length;
        return { data: data[0], totalPage, totalRecord };
    }
}

export default new ReportModel();
