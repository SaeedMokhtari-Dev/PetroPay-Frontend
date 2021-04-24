import IDeserialize from "app/interfaces/deserialize";

export default class EditStationUserResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
