import {makeAutoObservable} from "mobx";

export default class ActiveNewCustomerRequest
{
    public newCustomerId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
