import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CompanyListItem implements IDeserialize
{
    key: string;
    title: string;
    balance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
