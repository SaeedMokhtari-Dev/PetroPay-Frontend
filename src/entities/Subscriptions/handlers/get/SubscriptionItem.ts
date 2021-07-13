import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class SubscriptionItem implements IDeserialize
{
    key: number;
    subscriptionId: number;
    companyId: number;
    companyName: string;
    bundlesId: number;
    subscriptionCarNumbers: number;
    subscriptionPaymentMethod: string;
    subscriptionType: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionCost: number;
    subscriptionActive: boolean;
    paymentReferenceNumber: string;
    subscriptionDate: string;
    expired: boolean;
    subscriptionInvoiceNumber: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
