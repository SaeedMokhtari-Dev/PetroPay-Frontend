import { makeAutoObservable } from "mobx";

export default class GetSupplierRequest
{
    supplierId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
