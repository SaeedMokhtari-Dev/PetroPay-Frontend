import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class OdometerHistoryItem implements IDeserialize
{
    key: string;
    companyId: number;
    companyName: string;
    companyBranchId: number;
    companyBranchName: string;
    carId: number;
    carIdNumber: string;
    carTypeOfFuel: string;
    carDriverName: string;
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
