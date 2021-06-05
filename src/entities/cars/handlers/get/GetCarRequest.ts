import {makeAutoObservable} from "mobx";

export default class GetCarRequest
{
    public companyBranchId: number;
    public CompanyId: number;
    public needActivation: boolean;
    public pageSize: number;
    public pageIndex: number;
    public exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
