import express, { Express, Router } from 'express';
import { body, query, param } from 'express-validator';
import constants from '../constants/msg.constant';
import reportTollbothController from '../controllers/reportTollboth.controller';

const router: Router = express.Router();

router.get(
    '/report',
    [
        query('offset', constants.VALIDATE_DATA).isNumeric(),
        query('limit', constants.VALIDATE_DATA).isNumeric(),
        query('imei', constants.VALIDATE_DATA).isString(),
        query('start_date', constants.VALIDATE_DATA).isNumeric(),
        query('end_date', constants.VALIDATE_DATA).isNumeric(),
    ],
    reportTollbothController.getReport,
);
router.get(
    '/report/fee',
    [
        query('offset', constants.VALIDATE_DATA).isNumeric(),
        query('limit', constants.VALIDATE_DATA).isNumeric(),
        query('imei', constants.VALIDATE_DATA).isString(),
        query('start_date', constants.VALIDATE_DATA).isNumeric(),
        query('end_date', constants.VALIDATE_DATA).isNumeric(),
    ],

    reportTollbothController.getReportWithFee,
);

export default (app: Express) => {
    app.use('/api/v1/tollboths', router);
};
