import {makeAutoObservable} from "mobx";

export default class AddSubscriptionRequest
{
    companyId: number;
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
    subscriptionPaymentDocPhoto: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
