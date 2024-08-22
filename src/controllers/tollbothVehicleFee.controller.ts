import { NextFunction, Request, Response } from 'express';
import catchAsync from '../helper/catchAsync.helper';
import tollbothVehicleFeeService from '../services/tollbothVehicleFee.service';
import { GET, CREATED, UPDATE, DELETE } from '../core/success.response';

class TollbothVehicleFeeController {
    // [POST] /add-fee
    addFee = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const query = req.query;
            const body = req.body;
            const result = await tollbothVehicleFeeService.addFee(body, query);
            CREATED(res, result);
        },
    );

    // [PUT] /update-fee
    updateFee = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const params = req.query;
            const body = req.body;
            const result = await tollbothVehicleFeeService.updateFee(
                body,
                params,
            );
            UPDATE(res, result);
        },
    );
}

export default new TollbothVehicleFeeController();
