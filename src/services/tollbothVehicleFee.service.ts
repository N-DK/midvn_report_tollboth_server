import { BusinessLogicError } from '../core/error.response';
import { getConnection } from '../dbs/init.mysql';
import tollbothVehicleFeeModel from '../models/tollbothVehicleFee.model';

class TollbothVehicleFeeService {
    async addFee(body: any, query: any) {
        try {
            const { conn } = await getConnection();
            try {
                const data = await tollbothVehicleFeeModel.addFee(
                    conn,
                    query,
                    body,
                );
                return data;
            } catch (error) {
                throw error;
            } finally {
                conn.release();
            }
        } catch (error: any) {
            throw new BusinessLogicError(error.msg);
        }
    }

    async updateFee(body: any, query: any) {
        const { conn } = await getConnection();
        try {
            const data = await tollbothVehicleFeeModel.updateFee(
                conn,
                query,
                body,
            );
            return data;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    }
}
export default new TollbothVehicleFeeService();
