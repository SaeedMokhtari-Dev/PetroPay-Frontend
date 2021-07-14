import IDeserialize from "app/interfaces/deserialize";

export default class EditNewCustomerResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
