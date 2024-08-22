import { getConnection } from '../dbs/init.mysql';
import reportTollbothModel from '../models/reportTollboth.model';

class ReportService {
    async getReport(query: any) {
        try {
            const { conn } = await getConnection();
            try {
                const data = await reportTollbothModel.getReport(conn, query);
                return data;
            } catch (error) {
                throw error;
            } finally {
                conn.release();
            }
        } catch (error) {}
    }

    async getReportWithFee(query: {}) {
        try {
            const { conn } = await getConnection();
            try {
                const data = await reportTollbothModel.getReportWithFee(
                    conn,
                    query,
                );
                return data;
            } catch (error) {
                throw error;
            } finally {
                conn.release();
            }
        } catch (error) {}
    }
}

export default new ReportService();
