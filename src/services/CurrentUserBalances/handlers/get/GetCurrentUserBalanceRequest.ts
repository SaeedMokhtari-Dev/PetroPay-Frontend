import { makeAutoObservable } from "mobx";

export default class GetCurrentUserBalanceRequest
{

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
