import {makeAutoObservable} from "mobx";

export default class EditEmployeeRequest
{
    emplyeeId: number;
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
