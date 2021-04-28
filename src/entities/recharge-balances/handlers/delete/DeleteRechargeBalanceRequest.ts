import {makeAutoObservable} from "mobx";

export default class DeleteRechargeBalanceRequest
{
    public rechargeId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
