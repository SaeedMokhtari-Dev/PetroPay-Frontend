import IDeserialize from "../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PetroStationItem implements IDeserialize {
    stationBalance: number;
    stationBonusBalance: number;
    name: string;
    username: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);

        return this;
    }
}