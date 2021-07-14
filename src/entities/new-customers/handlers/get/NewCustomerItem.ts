import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class NewCustomerItem implements IDeserialize
{
    key: number;
    custReqId: number;
    custName: string;
    custCompany: string;
    custEmail: string;
    custPhoneNumber: string;
    custAddress: string;
    custReqStatus: boolean;
    cutReqDatetime: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
