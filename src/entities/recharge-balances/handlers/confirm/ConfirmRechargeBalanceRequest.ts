import {makeAutoObservable} from "mobx";

export default class ConfirmRechargeBalanceRequest
{
    public rechargeId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
