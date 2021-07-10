import {makeAutoObservable} from "mobx";

export default class EditEmployeeRequest
{
    employeesId: number;
    employeesNumberFrom: number;
    employeesNumberTo: number;
    employeesFeesMonthly: number;
    employeesFeesYearly: number;
    employeesNfcCost: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
