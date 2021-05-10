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
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
