import express, { Express, Router } from 'express';
import { body, query, param } from 'express-validator';
import constants from '../constants/msg.constant';
import tollbothVehicleFeeController from '../controllers/tollbothVehicleFee.controller';

const router: Router = express.Router();

router.post(
    '/add-fee',
    [query('tollboth_id', constants.VALIDATE_DATA).isNumeric()],

    tollbothVehicleFeeController.addFee,
);
router.put(
    '/update-fee',
    [query('tollboth_id', constants.VALIDATE_DATA).isNumeric()],

    tollbothVehicleFeeController.updateFee,
);

export default (app: Express) => {
    app.use('/api/v1/tollboths', router);
};
