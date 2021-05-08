import IDeserialize from "app/interfaces/deserialize";

export default class CarAddSubscriptionResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
