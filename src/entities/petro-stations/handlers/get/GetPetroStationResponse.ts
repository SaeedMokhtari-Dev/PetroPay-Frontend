import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetroStationItem from "./PetroStationItem";

export default class GetPetroStationResponse implements IDeserialize
{
    items: PetroStationItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetroStationItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
