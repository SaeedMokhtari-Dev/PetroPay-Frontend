import IDeserialize from "app/interfaces/deserialize";

export default class AddAppSettingResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
