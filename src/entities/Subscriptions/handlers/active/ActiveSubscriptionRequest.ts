import {makeAutoObservable} from "mobx";

export default class ActiveSubscriptionRequest
{
    public subscriptionId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
