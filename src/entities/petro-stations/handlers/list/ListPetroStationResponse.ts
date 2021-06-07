import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetroStationListItem from "./PetroStationListItem";

export default class ListPetroStationResponse implements IDeserialize
{
    items: PetroStationListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetroStationListItem().deserialize(x));

        return this;
    }
}
