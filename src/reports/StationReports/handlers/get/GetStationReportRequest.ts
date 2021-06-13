import { makeAutoObservable } from "mobx";

export default class GetStationReportRequest
{
    invoiceId: number;
    stationWorkerId: number;
    stationWorkerFname: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
