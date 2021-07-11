import IDeserialize from "app/interfaces/deserialize";

export default class DetailEmployeeMenuResponse implements IDeserialize
{
    employeeId: number;
    menuIds: number[];

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
