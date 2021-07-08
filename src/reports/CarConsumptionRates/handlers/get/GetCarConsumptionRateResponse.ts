import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarConsumptionRateItem from "./CarConsumptionRateItem";

export default class GetCarConsumptionRateResponse implements IDeserialize
{
    items: CarConsumptionRateItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarConsumptionRateItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
