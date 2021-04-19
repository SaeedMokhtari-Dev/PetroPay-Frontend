import IDeserialize from "app/interfaces/deserialize";

export default class DetailBundleResponse implements IDeserialize
{
    bundlesId: number;
    bundlesNumberFrom: number;
    bundlesNumberTo: number;
    bundlesFeesMonthly: number;
    bundlesFeesYearly: number;
    bundlesNfcCost: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
