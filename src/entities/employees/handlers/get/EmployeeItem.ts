import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class EmployeeItem implements IDeserialize
{
    key: number;
    emplyeeId: number;
    emplyeeName: string;
    emplyeePhone: string;
    emplyeeEmail: string;
    emplyeeCode: string;
    emplyeeUserName: string;
    emplyeeStatus: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
