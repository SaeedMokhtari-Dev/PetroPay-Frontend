import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import SubscriptionItem from "./SubscriptionItem";

export default class GetSubscriptionResponse implements IDeserialize
{
    items: SubscriptionItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new SubscriptionItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
