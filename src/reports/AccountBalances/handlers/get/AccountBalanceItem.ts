import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class AccountBalanceItem implements IDeserialize
{
    key: string;
    accountId: number;
    accountTaype: string;
    accountName: string;
    sumTransAmount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
