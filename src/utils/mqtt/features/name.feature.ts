import axios from 'axios';
import { mylogger } from '../../../logger';
import tollboth from '../../tollboth.utils';

let cars: { [key: string]: any } = {};

const tollboths = tollboth.initData();

const nameFeature = async (client: any, data: any, requestId: any) => {
    try {
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
    }
};

export { nameFeature };
