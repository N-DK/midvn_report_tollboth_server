import { Express } from 'express';
import reportTollbothRoute from './reportTollboth.route';
import tollbothVehicleFeeRoute from './tollbothVehicleFee.route';

export default (app: Express) => {
    reportTollbothRoute(app);
    tollbothVehicleFeeRoute(app);
};
