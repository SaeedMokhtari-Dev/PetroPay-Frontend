import {makeAutoObservable} from "mobx";

export default class AddBundleRequest
{
    bundlesNumberFrom: number;
    bundlesNumberTo: number;
    bundlesFeesMonthly: number;
    bundlesFeesYearly: number;
    bundlesNfcCost: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
