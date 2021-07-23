import IDeserialize from "../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PetrolStationItem implements IDeserialize {
    key: number;
    name: string;
    balance: number;
    bonus: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}