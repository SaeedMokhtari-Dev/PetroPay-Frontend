import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import BranchItem from "./BranchItem";

export default class GetBranchResponse implements IDeserialize
{
    items: BranchItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new BranchItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
