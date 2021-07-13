import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarListItem implements IDeserialize
{
    key: number;
    carNumber: string;
    branchName: string;
    disabled: boolean;
    balance: number;
    carOdometerRecordRequired: boolean;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
