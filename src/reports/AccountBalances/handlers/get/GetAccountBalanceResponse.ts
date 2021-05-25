import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import AccountBalanceItem from "./AccountBalanceItem";

export default class GetAccountBalanceResponse implements IDeserialize
{
    items: AccountBalanceItem[] = [];
    totalCount: number;
    sumAccountBalance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new AccountBalanceItem().deserialize(x));
        this.totalCount = this.totalCount;
        this.sumAccountBalance = this.sumAccountBalance;

        return this;
    }
}
