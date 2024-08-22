import { PoolConnection } from 'mysql2';
import DatabaseModel from './database.model';

class TollbothVehicleFeeModel extends DatabaseModel {
    constructor() {
        super();
    }

    async addFee(con: PoolConnection, query: any, body: any) {
        const { tollboth_id } = query;
        const payload = body;

        let queryText = `INSERT INTO tbl_tollboths_vehicle_fee (tollboth_id, vehicle_id, fee) VALUES `;

        payload.forEach((item: any) => {
            queryText += `(${tollboth_id}, ${item.id}, ${item.fee}),`;
        });

        queryText = queryText.slice(0, -1);

        return new Promise((resolve, reject) => {
            con.query(queryText, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    async updateFee(con: PoolConnection, query: any, body: any) {
        const { tollboth_id } = query;
        const payload = body;

        let queryText = `UPDATE tbl_tollboths_vehicle_fee SET fee = CASE vehicle_id `;
        payload.forEach((item: any) => {
            queryText += `WHEN ${item.id} THEN ${item.fee} `;
        });

        queryText += `END, update_at = ${Date.now()} WHERE vehicle_id IN (${payload
            .map((item: any) => item.id)
            .join(',')})`;
        queryText += ` AND tollboth_id = ${tollboth_id} AND is_editable = 1`;

        return new Promise((resolve, reject) => {
            con.query(queryText, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export default new TollbothVehicleFeeModel();
