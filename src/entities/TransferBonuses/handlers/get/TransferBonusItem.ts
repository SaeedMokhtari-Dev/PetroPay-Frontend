import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class TransferBonusItem implements IDeserialize
{
    key: number;
    transId: number;
    transDate: string;
    accountId: number;
    accountName: string;
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
