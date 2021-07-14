import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import NewCustomerItem from "./NewCustomerItem";

export default class GetNewCustomerResponse implements IDeserialize
{
    items: NewCustomerItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new NewCustomerItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
