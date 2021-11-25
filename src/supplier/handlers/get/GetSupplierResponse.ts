import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PetroStationItem from "./PetroStationItem";

export default class GetSupplierResponse implements IDeserialize
{
    stationBalance: number;
    stationBonusBalance: number;

    petroStationItems: PetroStationItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        return this;
    }
}
