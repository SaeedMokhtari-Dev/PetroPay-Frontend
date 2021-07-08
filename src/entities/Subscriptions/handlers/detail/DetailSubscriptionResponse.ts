import IDeserialize from "app/interfaces/deserialize";
import SubscriptionCar from "./SubscriptionCar";

export default class DetailSubscriptionResponse implements IDeserialize
{
    subscriptionId: number;
    companyId: number;
    companyName: string;
    bundlesId: number;
    subscriptionCarNumbers: number;
    subscriptionPaymentMethod: string;
    payFromCompanyBalance: boolean;
    petropayAccountId: number;
    numberOfDateDiff: number;
    subscriptionType: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionCost: number;
    subscriptionActive: boolean;
    paymentReferenceNumber: string;
    subscriptionDate: string;
    subscriptionPaymentDocPhoto: string;

    subscriptionCars: SubscriptionCar[];

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
