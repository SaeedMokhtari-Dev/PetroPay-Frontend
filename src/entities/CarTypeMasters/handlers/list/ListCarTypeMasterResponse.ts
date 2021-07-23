import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarTypeMasterListItem from "./CarTypeMasterListItem";

export default class ListCarTypeMasterResponse implements IDeserialize
{
    items: CarTypeMasterListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarTypeMasterListItem().deserialize(x));

        return this;
    }
}
