import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import StationUserItem from "./StationUserItem";

export default class GetStationUserResponse implements IDeserialize
{
    items: StationUserItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new StationUserItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
