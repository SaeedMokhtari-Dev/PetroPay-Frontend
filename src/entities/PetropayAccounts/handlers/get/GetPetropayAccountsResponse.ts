import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetropayAccountItem from "./PetropayAccountItem";

export default class GetPetropayAccountsResponse implements IDeserialize
{
    items: PetropayAccountItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetropayAccountItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
