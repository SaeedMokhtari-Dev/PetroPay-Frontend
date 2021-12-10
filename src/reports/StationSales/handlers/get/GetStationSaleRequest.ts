import { makeAutoObservable } from "mobx";

export default class GetStationSaleRequest
{
    companyId: number;
    stationId: number;
    stationWorkerId: number;
    stationWorkerFname: string;
    invoiceFuelType: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
