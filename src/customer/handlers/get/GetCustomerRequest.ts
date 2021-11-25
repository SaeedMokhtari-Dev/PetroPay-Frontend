import { makeAutoObservable } from "mobx";

export default class GetCustomerRequest
{
    companyId: number;
    companyBranchId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
