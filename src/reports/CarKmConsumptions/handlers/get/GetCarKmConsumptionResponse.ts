import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarKmConsumptionItem from "./CarKmConsumptionItem";

export default class GetCarKmConsumptionResponse implements IDeserialize
{
    items: CarKmConsumptionItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarKmConsumptionItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
