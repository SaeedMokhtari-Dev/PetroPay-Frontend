import {makeAutoObservable} from "mobx";

export default class CalculateSubscriptionRequest
{
    public bundlesId: number;
    public subscriptionCarNumbers: number;
    public subscriptionType: string;
    public subscriptionStartDate: string;
    public subscriptionEndDate: string;
    public couponCode: string;
    public numberOfDateDiff: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
