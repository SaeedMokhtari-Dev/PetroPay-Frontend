import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetrolPriceListItem from "./PetrolPriceListItem";

export default class ListPetrolPriceResponse implements IDeserialize
{
    items: PetrolPriceListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetrolPriceListItem().deserialize(x));

        return this;
    }
}
