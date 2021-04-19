import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class BundleItem implements IDeserialize
{
    key: number;
    /*bundlesId: number;*/
    bundlesNumberFrom: number;
    bundlesNumberTo: number;
    bundlesFeesMonthly: number;
    bundlesFeesYearly: number;
    bundlesNfcCost: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
