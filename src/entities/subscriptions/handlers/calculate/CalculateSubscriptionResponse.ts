import IDeserialize from "app/interfaces/deserialize";

export default class CalculateSubscriptionResponse implements IDeserialize
{
    public bundlesId: number;
    public subscriptionCost: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
