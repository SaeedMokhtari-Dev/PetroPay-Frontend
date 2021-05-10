import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarTransactionItem implements IDeserialize
{
    key: string;
    carId: number;
    carIdNumber: string;
    companyBranchId: number;
    companyBranchName: string;
    companyId: number;
    companyName: string;
    transId: number;
    transDate: string;
    transDocument: string;
    transAmount: number;
    transReference: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
