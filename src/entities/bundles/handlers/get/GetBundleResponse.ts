import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import BundleItem from "./BundleItem";

export default class GetBundleResponse implements IDeserialize
{
    items: BundleItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new BundleItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
