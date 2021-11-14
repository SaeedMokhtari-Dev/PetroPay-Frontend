import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import StationSaleItem from "./StationSaleItem";

export default class GetStationSaleResponse implements IDeserialize
{
    items: StationSaleItem[] = [];
    totalCount: number;
    sumInvoiceAmount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new StationSaleItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
