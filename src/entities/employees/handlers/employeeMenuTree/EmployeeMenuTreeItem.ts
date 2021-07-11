import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class EmployeeMenuTreeItem implements IDeserialize
{
    key: string;
    arTitle: string;
    enTitle: string;
    urlRoute: string;


    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
