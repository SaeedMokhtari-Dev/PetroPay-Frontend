import {makeAutoObservable} from "mobx";

export default class AddEmployeeRequest
{
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
