import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import BranchListItem from "./BranchListItem";

export default class ListBranchResponse implements IDeserialize
{
    items: BranchListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new BranchListItem().deserialize(x));

        return this;
    }
}
