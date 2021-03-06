import {makeAutoObservable} from "mobx";

export default class AddNewCustomerRequest
{
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
