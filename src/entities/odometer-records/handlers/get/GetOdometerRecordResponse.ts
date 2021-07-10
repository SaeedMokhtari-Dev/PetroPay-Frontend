import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import OdometerRecordItem from "./OdometerRecordItem";

export default class GetOdometerRecordResponse implements IDeserialize
{
    items: OdometerRecordItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new OdometerRecordItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
