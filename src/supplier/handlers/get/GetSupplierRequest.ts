import { makeAutoObservable } from "mobx";

export default class GetSupplierRequest
{
    supplierId: number;
    supplierBranchId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
