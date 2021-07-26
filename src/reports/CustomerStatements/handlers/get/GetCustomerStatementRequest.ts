import { makeAutoObservable } from "mobx";

export default class GetCustomerStatementRequest
{
    dateFrom: string;
    dateTo: string;
    companyId: number;
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
