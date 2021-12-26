import { makeAutoObservable } from "mobx";

export default class GetOdometerHistoryRequest
{
    carIdNumber: string;
    companyBranchId: number;
    companyBranchName: string;
    companyId: number;
    dateFrom: string;
    dateTo: string;
    /*companyName: string;*/
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
