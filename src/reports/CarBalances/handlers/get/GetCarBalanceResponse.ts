import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarBalanceItem from "./CarBalanceItem";

export default class GetCarBalanceResponse implements IDeserialize
{
    items: CarBalanceItem[] = [];
    totalCount: number;
    sumCarBalance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarBalanceItem().deserialize(x));
        this.totalCount = this.totalCount;
        this.sumCarBalance = this.sumCarBalance;

        return this;
    }
}
