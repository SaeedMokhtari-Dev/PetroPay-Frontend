import {makeAutoObservable} from "mobx";

export default class CarAddSubscriptionRequest
{
    public subscriptionId: number;
    public SubscriptionCarIds: number[];

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
