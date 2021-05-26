import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PetrolStationListItem implements IDeserialize
{
    key: string;
    stationLucationName: string;
    stationName: string;
    stationNameAr: string;
    stationDiesel: boolean;
    stationLatitude: number;
    stationLongitude: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
