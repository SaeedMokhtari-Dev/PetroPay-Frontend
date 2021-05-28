import {makeAutoObservable} from "mobx";
import IDeserialize from "../../../app/interfaces/deserialize";

export default class CompanyBranchItem implements IDeserialize
{
    key: number;
    branchName: string;
    branchBalance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
