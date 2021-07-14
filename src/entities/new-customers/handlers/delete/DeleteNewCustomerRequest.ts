import {makeAutoObservable} from "mobx";

export default class DeleteNewCustomerRequest
{
    public newCustomerId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
