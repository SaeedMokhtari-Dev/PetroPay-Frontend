import {makeAutoObservable} from "mobx";

export default class GetCarRequest
{
    public companyBranchId: number;
    public CompanyId: number;
    public pageSize: number;
    public pageIndex: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
