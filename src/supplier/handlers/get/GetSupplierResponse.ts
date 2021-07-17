import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class GetSupplierResponse implements IDeserialize
{
    stationBalance: number;
    stationBonusBalance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        return this;
    }
}
