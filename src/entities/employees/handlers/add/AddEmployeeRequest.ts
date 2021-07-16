import {makeAutoObservable} from "mobx";

export default class AddEmployeeRequest
{
    emplyeeName: string;
    emplyeePhone: string;
    emplyeeEmail: string;
    emplyeeCode: string;
    emplyeeUserName: string;
    emplyeePassword: string;
    emplyeeStatus: string;
    emplyeePhoto: string;


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
