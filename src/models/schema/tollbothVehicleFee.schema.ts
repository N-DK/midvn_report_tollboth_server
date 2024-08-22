import { TollbothVehicleFeeType } from '../../types/tollbothVehicleFee.type';

class TollbothVehicleFee {
    tollboth_id: number;
    vehicle_id: number;
    fee: string;
    is_editable: number;
    update_at: number;

    constructor({
        tollboth_id,
        vehicle_id,
        fee,
        is_editable,
        update_at,
    }: TollbothVehicleFeeType) {
        this.tollboth_id = tollboth_id;
        this.vehicle_id = vehicle_id;
        this.fee = fee;
        this.is_editable = is_editable;
        this.update_at = update_at;
    }
}

export default TollbothVehicleFee;
