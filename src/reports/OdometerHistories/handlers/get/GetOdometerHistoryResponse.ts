import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import OdometerHistoryItem from "./OdometerHistoryItem";

export default class GetOdometerHistoryResponse implements IDeserialize
{
    items: OdometerHistoryItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new OdometerHistoryItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
