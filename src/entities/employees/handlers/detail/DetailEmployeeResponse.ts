import IDeserialize from "app/interfaces/deserialize";

export default class DetailEmployeeResponse implements IDeserialize
{
    employeesId: number;
    employeesNumberFrom: number;
    employeesNumberTo: number;
    employeesFeesMonthly: number;
    employeesFeesYearly: number;
    employeesNfcCost: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
