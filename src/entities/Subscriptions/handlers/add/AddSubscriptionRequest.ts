import {makeAutoObservable} from "mobx";

export default class AddSubscriptionRequest
{
    subscriptionId: number;
    companyId: number;
    bundlesId: number;
    subscriptionCarNumbers: number;
    subscriptionPaymentMethod: string;
    subscriptionType: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionCost: number;
    paymentReferenceNumber: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
