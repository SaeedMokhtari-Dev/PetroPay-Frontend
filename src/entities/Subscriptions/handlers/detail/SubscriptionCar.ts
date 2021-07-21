import IDeserialize from "../../../../app/interfaces/deserialize";

export default class SubscriptionCar implements IDeserialize
{
    key: number;
    disabled: boolean;
    branchName: string;
    branchId: number;
    carIdNumber: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}