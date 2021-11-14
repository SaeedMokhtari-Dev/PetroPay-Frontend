import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetrolCompanyItem from "./PetrolCompanyItem";

export default class GetPetrolCompaniesResponse implements IDeserialize
{
    items: PetrolCompanyItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetrolCompanyItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
