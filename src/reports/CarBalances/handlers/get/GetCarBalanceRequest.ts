import { makeAutoObservable } from "mobx";

export default class GetCarBalanceRequest
{
    carIdNumber: string;
    companyBranchName: string;
    invoiceDataTimeFrom: string;
    invoiceDataTimeTo: string;
    serviceDescription: string;
    companyId: number;
    companyName: string;
    companyBranchId: number;
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
