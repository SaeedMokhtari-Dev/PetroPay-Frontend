import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import MenuItem from "./MenuItem";

export default class GetMenuResponse implements IDeserialize
{
    items: MenuItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new MenuItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
