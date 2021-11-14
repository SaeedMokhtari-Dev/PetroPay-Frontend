import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import StationReportItem from "./StationReportItem";

export default class GetStationReportResponse implements IDeserialize
{
    items: StationReportItem[] = [];
    totalCount: number;
    sumInvoiceAmount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new StationReportItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
