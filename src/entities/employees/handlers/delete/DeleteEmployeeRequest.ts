import {makeAutoObservable} from "mobx";

export default class DeleteEmployeeRequest
{
    public employeesId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
