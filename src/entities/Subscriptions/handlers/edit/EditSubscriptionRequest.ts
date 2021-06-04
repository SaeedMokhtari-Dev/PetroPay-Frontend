import {makeAutoObservable} from "mobx";

export default class EditSubscriptionRequest
{
    subscriptionId: number;
    bundlesId: number;
    subscriptionCarNumbers: number;
    subscriptionPaymentMethod: string;
    payFromCompanyBalance: boolean;
    petropayAccountId: number;

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