import { makeAutoObservable } from "mobx";

export default class GetStationReportRequest
{
    stationWorkerId: number;
    stationWorkerFname: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;
    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
