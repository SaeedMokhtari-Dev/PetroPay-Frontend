import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class GetCurrentUserBalanceResponse implements IDeserialize
{
    balance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        return this;
    }
}
