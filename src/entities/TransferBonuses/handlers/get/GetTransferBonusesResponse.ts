import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import TransferBonusItem from "./TransferBonusItem";

export default class GetTransferBonusesResponse implements IDeserialize
{
    items: TransferBonusItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new TransferBonusItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
