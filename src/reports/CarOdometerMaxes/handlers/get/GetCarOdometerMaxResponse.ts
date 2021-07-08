import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarOdometerMaxItem from "./CarOdometerMaxItem";

export default class GetCarOdometerMaxResponse implements IDeserialize
{
    items: CarOdometerMaxItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarOdometerMaxItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
