import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CustomerStatementItem implements IDeserialize
{
    key: string;
    transactionDataTime: string;
    accountId: number;
    companyId: number;
    companyName: string;
    transDocument: string;
    sumTransAmount: number;
    accountName: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
