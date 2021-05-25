import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetropayAccountListItem from "./PetropayAccountListItem";

export default class ListPetropayAccountResponse implements IDeserialize
{
    items: PetropayAccountListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetropayAccountListItem().deserialize(x));

        return this;
    }
}
