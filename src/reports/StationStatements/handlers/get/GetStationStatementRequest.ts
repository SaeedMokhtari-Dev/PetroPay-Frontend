import { makeAutoObservable } from "mobx";

export default class GetStationStatementRequest
{
    companyId: number;
    stationId: number;
    stationWorkerId: number;
    stationName: string;
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
