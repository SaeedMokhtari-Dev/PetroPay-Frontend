import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CompanyItem from "./CompanyItem";

export default class GetCompaniesResponse implements IDeserialize
{
    items: CompanyItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CompanyItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
