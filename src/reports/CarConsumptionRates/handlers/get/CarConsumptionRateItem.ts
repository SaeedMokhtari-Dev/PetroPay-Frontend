import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarConsumptionRateItem implements IDeserialize
{
    key: string;
    companyId: number;
    companyBranchId: number;
    companyBranchName: string;
    carId: number;
    carIdNumber: string;
    carDriverName: string;
    dateMin: string;
    dateMax: string;
    literConsumption: number;
    amountConsumption: number;
    kmConsumption: number;
    cunsumptionRate: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
