import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import RechargeBalanceItem from "./RechargeBalanceItem";

export default class GetRechargeBalanceResponse implements IDeserialize
{
    items: RechargeBalanceItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new RechargeBalanceItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
