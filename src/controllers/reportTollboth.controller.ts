import { NextFunction, Request, Response } from 'express';
import reportService from '../services/report.service';
import catchAsync from '../helper/catchAsync.helper';
import { GET } from '../core/success.response';

class ReportTollbothController {
    // [GET] /report
    getReport = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const query = req.query;
            const result = await reportService.getReport(query);
            GET(res, result?.data, result?.totalPage, result?.totalRecord);
        },
    );

    // [GET] /report/fee
    getReportWithFee = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const query = req.query;
            const result = await reportService.getReportWithFee(query);
            GET(res, result?.data, result?.totalPage, result?.totalRecord);
        },
    );
}

export default new ReportTollbothController();
