import IDeserialize from "app/interfaces/deserialize";

export default class DetailSubscriptionResponse implements IDeserialize
{
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

    SubscriptionCarIds: number[];

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
