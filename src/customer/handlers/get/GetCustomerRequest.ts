import { makeAutoObservable } from "mobx";

export default class GetCustomerRequest
{
    companyId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
