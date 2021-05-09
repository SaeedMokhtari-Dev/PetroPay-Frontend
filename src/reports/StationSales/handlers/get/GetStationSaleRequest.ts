import { makeAutoObservable } from "mobx";

export default class GetStationSaleRequest
{
    stationWorkerId: number;
    stationWorkerFname: string;
    invoiceFuelType: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
