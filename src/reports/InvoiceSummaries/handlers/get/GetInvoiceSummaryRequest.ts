import { makeAutoObservable } from "mobx";

export default class GetInvoiceSummaryRequest
{
    carIdNumber: string;
    carId: number;
    companyBranchName: string;
    companyBranchId: number;
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
