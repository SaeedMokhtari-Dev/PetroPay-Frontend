import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class OdometerRecordItem implements IDeserialize
{
    key: number;
    odometerRecordId: number;
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
