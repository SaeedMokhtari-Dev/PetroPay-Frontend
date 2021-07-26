import { makeAutoObservable } from "mobx";

export default class GetCompanyBranchStatementRequest
{
    dateFrom: string;
    dateTo: string;
    companyId: number;
    branchId: number;
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
