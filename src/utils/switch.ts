import stringConstant from '../constants/string.constant';
import geolib from 'geolib';

const __switch_ = {
    km2_2_m2(d: number) {
        return d * Math.pow(10, 6);
    },
    m2_2_km2(d: number) {
        return d * Math.pow(10, -6);
    },
    fixedNum(d: number) {
        return Number(d?.toFixed?.(5));
    },
    fixedString(d: number) {
        return d?.toFixed?.(5);
    },
    fixedFloor2(num: any) {
        return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    },

    getLatLng(node: [number, number]) {
        return {
            latitude: Number(node?.[0]),
            longitude: Number(node?.[1]),
        };
    },
    getLatLngBound(bound: [[number, number]]) {
        return bound?.map?.((p) => ({
            latitude: p?.[0],
            longitude: p?.[1],
        }));
    },
    getBound(bound: [[number, number]]) {
        const boundLatLng = __switch_.getLatLngBound(bound);

        const { maxLat, maxLng, minLat, minLng } =
            geolib.getBounds(boundLatLng);

        const bound_ = [
            [minLat, minLng],
            [minLat, maxLng],
            [maxLat, maxLng],
            [maxLat, minLng],
        ];

        return bound_;
    },

    getKeyFloor2(node: [number, number]) {
        const step = stringConstant.step;
        const minLat = __switch_.fixedFloor2(Number(node?.[0]));
        const minLng = __switch_.fixedFloor2(Number(node?.[1]));
        const maxLat = __switch_.fixedFloor2(Number(node?.[0]) + step);
        const maxLng = __switch_.fixedFloor2(Number(node?.[1]) + step);

        return {
            key: `${minLat}_${minLng}__${maxLat}_${maxLng}`,
            payload: {
                minLat,
                minLng,
                maxLat,
                maxLng,
            },
        };
    },
};

export default __switch_;
