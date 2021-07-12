import IDeserialize from "app/interfaces/deserialize";

export default class CalculateSubscriptionResponse implements IDeserialize
{
    bundlesId: number;
    subTotal: number;
    discount: number;
    taxRate: number;
    tax: number;
    vatRate: number;
    vat: number;
    couponId: number;
    subscriptionCost: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
