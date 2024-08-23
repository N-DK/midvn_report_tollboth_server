import { mylogger } from '../../../logger';
import tollboth from '../../tollboth.utils';

let cars: { [key: string]: any } = {};

let tollboths: any = {};

let isInitializing = false;

const tollbothFeature = async (client: any, data: any, requestId: any) => {
    try {
        if (Object.keys(tollboths).length === 0 && !isInitializing) {
            isInitializing = true;
            tollboths = await tollboth.initData();
            isInitializing = false;
        }

        if (!data || !Object.keys(data).length) return;
        const { vid, sp, state, resync } = data[0];
        const isStopped = state?.toString() !== '3' && Number(sp) <= 0;
        if (isStopped && cars[`${vid}-${resync}`]?.isStopChecked) {
            return;
        }

        tollboth.report(cars, tollboths, data);
    } catch (error) {
        console.log(error);
        mylogger.error('message', ['nameFeature', requestId, error]);
        isInitializing = false; // Đảm bảo đặt lại trong trường hợp có lỗi
    }
};

export { tollbothFeature };
