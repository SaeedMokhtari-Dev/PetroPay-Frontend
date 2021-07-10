import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import EmployeeItem from "./EmployeeItem";

export default class GetEmployeeResponse implements IDeserialize
{
    items: EmployeeItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new EmployeeItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
