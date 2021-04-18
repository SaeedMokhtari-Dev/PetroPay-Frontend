import IDeserialize from "app/interfaces/deserialize";

export default class LoginResponse implements IDeserialize
{
    accessToken: string;
    refreshToken: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}