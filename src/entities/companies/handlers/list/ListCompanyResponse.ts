import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CompanyListItem from "./CompanyListItem";

export default class ListCompanyResponse implements IDeserialize
{
    items: CompanyListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CompanyListItem().deserialize(x));

        return this;
    }
}
