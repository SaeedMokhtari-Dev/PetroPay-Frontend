import { makeAutoObservable } from "mobx";

export default class GetCarTransactionRequest
{
    carIdNumber: string;
    companyBranchName: string;
    transDateFrom: string;
    transDateTo: string;
    companyId: number;
    companyName: string;
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
