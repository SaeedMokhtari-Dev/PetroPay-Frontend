import { makeAutoObservable } from "mobx";

export default class GetCarConsumptionRateRequest
{
    carIdNumber: string;
    companyBranchId: number;
    companyBranchName: string;
    /*transDateFrom: string;
    transDateTo: string;*/
    companyId: number;
    /*companyName: string;*/
    dateFrom: string;
    dateTo: string;
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
