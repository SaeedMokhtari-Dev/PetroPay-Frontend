import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class BranchListItem implements IDeserialize
{
    key: string;
    title: string;
    balance: number;
    companyId: number;
    companyName: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
