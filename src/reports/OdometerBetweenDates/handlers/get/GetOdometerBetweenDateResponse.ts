import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import OdometerBetweenDateItem from "./OdometerBetweenDateItem";

export default class GetOdometerBetweenDateResponse implements IDeserialize
{
    items: OdometerBetweenDateItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new OdometerBetweenDateItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
