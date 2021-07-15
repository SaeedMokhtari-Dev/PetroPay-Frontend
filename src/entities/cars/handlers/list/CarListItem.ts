import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarListItem implements IDeserialize
{
    key: number;
    carNumber: string;
    branchId: number;
    branchName: string;
    disabled: boolean;
    balance: number;
    carOdometerRecordRequired: boolean;
    companyId: number;
    companyName: string;
    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
