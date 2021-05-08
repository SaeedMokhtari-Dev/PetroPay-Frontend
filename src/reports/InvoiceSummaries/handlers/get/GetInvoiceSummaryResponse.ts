import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import InvoiceSummaryItem from "./InvoiceSummaryItem";

export default class GetInvoiceSummaryResponse implements IDeserialize
{
    items: InvoiceSummaryItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new InvoiceSummaryItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
