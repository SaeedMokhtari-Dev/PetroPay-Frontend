import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarModelMasterListItem from "./CarModelMasterListItem";

export default class ListCarModelMasterResponse implements IDeserialize
{
    items: CarModelMasterListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarModelMasterListItem().deserialize(x));

        return this;
    }
}
