import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import StationStatementItem from "./StationStatementItem";

export default class GetStationStatementResponse implements IDeserialize
{
    items: StationStatementItem[] = [];
    totalCount: number;
    sumTransAmount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new StationStatementItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
