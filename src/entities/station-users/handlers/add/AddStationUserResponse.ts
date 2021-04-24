import IDeserialize from "app/interfaces/deserialize";

export default class AddStationUserResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
