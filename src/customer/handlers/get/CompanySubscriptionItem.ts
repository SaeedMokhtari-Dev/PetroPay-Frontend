import IDeserialize from "../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CompanySubscriptionItem implements IDeserialize {
    key: number;
    startDate: string;
    endDate: string;
    alarm: boolean;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}