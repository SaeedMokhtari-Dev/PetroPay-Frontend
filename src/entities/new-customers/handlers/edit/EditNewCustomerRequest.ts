import {makeAutoObservable} from "mobx";

export default class EditNewCustomerRequest
{
    custReqId: number;
    custName: string;
    custCompany: string;
    custEmail: string;
    custPhoneNumber: string;
    custAddress: string;
    custReqStatus: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
