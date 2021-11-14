import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import StationUserListItem from "./StationUserListItem";

export default class ListStationUserResponse implements IDeserialize
{
    items: StationUserListItem[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new StationUserListItem().deserialize(x));

        return this;
    }
}
