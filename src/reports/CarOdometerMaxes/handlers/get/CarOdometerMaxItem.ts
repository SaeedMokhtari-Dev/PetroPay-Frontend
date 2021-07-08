import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarOdometerMaxItem implements IDeserialize
{
    key: string;
    carId: number;
    carIdNumber: string;
    odometerRecordDate: string;
    odometerValue: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
