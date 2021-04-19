import {makeAutoObservable} from "mobx";

export default class EditBundleRequest
{
    bundlesId: number;
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
