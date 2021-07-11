import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import EmployeeMenuTreeItem from "./EmployeeMenuTreeItem";

export default class TreeEmployeeMenuResponse implements IDeserialize
{
    key: string;
    arTitle: string;
    enTitle: string;
    urlRoute: string;

    items: EmployeeMenuTreeItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new EmployeeMenuTreeItem().deserialize(x));

        return this;
    }
}
