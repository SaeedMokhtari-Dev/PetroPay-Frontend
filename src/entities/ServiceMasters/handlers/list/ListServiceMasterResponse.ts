import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import ServiceMasterListItem from "./ServiceMasterListItem";

export default class ListServiceMasterResponse implements IDeserialize
{
    items: ServiceMasterListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new ServiceMasterListItem().deserialize(x));

        return this;
    }
}
