import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarBrandMasterListItem from "./CarBrandMasterListItem";

export default class ListCarBrandMasterResponse implements IDeserialize
{
    items: CarBrandMasterListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarBrandMasterListItem().deserialize(x));

        return this;
    }
}
