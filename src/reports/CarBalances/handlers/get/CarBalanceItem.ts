import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarBalanceItem implements IDeserialize
{
    key: number;
    companyId: number;
    companyName: string;
    companyBranchId: number;
    companyBranchName: string;
    carIdNumber: string;
    carDriverName: string;
    consumptionValue: number;
    carBalnce: number;
    carId: number;
    subscriptionEndDate: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
