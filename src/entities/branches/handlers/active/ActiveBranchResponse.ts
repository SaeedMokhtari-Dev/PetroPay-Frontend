import IDeserialize from "app/interfaces/deserialize";

export default class ActiveBranchResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
