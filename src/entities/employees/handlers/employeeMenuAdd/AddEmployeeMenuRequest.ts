import {makeAutoObservable} from "mobx";

export default class AddEmployeeMenuRequest
{
    employeeId: number;
    menuIds: number[];

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
