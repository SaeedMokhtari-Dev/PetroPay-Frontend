import { makeAutoObservable } from "mobx";

export default class GetStationReportRequest
{
    invoiceId: number;
    stationId: number;
    stationWorkerId: number;
    serviceId: number;
    stationWorkerFname: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;
    serviceArDescription: string;
    paymentMethodName: string;
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
