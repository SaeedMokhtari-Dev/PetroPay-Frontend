import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarItem from "./CarItem";

export default class GetCarResponse implements IDeserialize
{
    items: CarItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
