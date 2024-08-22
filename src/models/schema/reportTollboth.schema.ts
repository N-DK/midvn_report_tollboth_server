import { ReportTollbothType } from '../../types/reportTollboth.type';

class ReportTollboth {
    id: number;
    imei: string;
    lat: string;
    lng: string;
    start_time: number;
    tollboth_name: string;
    dri: string;
    create_at: number;

    constructor({
        id,
        imei,
        lat,
        lng,
        start_time,
        tollboth_name,
        dri,
        create_at,
    }: ReportTollbothType) {
        this.id = id;
        this.imei = imei;
        this.lat = lat;
        this.lng = lng;
        this.start_time = start_time;
        this.tollboth_name = tollboth_name;
        this.dri = dri;
        this.create_at = create_at;
    }
}

export default ReportTollboth;
