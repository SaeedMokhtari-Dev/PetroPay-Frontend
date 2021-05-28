import {makeAutoObservable} from "mobx";
import IDeserialize from "../../../app/interfaces/deserialize";

export default class CompanyListItem implements IDeserialize
{
    key: number;
    name: string;
    balance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
