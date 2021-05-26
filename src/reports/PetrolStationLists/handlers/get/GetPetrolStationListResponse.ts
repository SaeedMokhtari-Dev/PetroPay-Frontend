import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetrolStationListItem from "./PetrolStationListItem";

export default class GetPetrolStationListResponse implements IDeserialize
{
    items: PetrolStationListItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PetrolStationListItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
