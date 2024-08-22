import { VehicleType } from '../../types/vehicleType.type';

class VehicleTypeSchema {
    id: number;
    name: string;
    vehicle_icon_id: number;
    max_speed: number;
    rule: number;
    publish: number;
    is_delete: number;
    create_at: number;
    update_at: number;

    constructor({
        id,
        name,
        vehicle_icon_id,
        max_speed,
        rule,
        publish,
        is_delete,
        create_at,
        update_at,
    }: VehicleType) {
        this.id = id;
        this.name = name;
        this.vehicle_icon_id = vehicle_icon_id;
        this.max_speed = max_speed;
        this.rule = rule;
        this.publish = publish;
        this.is_delete = is_delete;
        this.create_at = create_at;
        this.update_at = update_at;
    }
}

export default VehicleTypeSchema;
