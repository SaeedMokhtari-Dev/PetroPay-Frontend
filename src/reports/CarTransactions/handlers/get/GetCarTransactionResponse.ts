import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarTransactionItem from "./CarTransactionItem";

export default class GetCarTransactionResponse implements IDeserialize
{
    items: CarTransactionItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarTransactionItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
