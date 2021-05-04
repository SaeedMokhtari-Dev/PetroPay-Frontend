import {makeAutoObservable} from "mobx";

export default class DeleteSubscriptionRequest
{
    public subscriptionId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
