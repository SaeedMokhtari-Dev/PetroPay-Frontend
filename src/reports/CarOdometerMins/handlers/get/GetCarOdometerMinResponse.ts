import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarOdometerMinItem from "./CarOdometerMinItem";

export default class GetCarOdometerMinResponse implements IDeserialize
{
    items: CarOdometerMinItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarOdometerMinItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
