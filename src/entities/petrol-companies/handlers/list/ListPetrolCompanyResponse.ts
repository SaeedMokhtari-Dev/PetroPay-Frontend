import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetrolCompanyListItem from "./PetrolCompanyListItem";

export default class ListPetrolCompanyResponse implements IDeserialize
{
    items: PetrolCompanyListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetrolCompanyListItem().deserialize(x));

        return this;
    }
}
