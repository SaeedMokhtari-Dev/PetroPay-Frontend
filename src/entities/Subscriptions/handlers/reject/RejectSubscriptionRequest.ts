import {makeAutoObservable} from "mobx";

export default class RejectSubscriptionRequest
{
    public subscriptionId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
