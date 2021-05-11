import {makeAutoObservable} from "mobx";

export default class ChargeBalanceBranchRequest
{
    public branchId: number;
    public increaseAmount: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
