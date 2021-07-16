import IDeserialize from "app/interfaces/deserialize";

export default class DetailEmployeeResponse implements IDeserialize
{
    emplyeeId: number;
    emplyeeName: string;
    emplyeePhone: string;
    emplyeeEmail: string;
    emplyeeCode: string;
    emplyeeUserName: string;
    emplyeePassword: string;
    emplyeeStatus: string;
    emplyeePhoto: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
