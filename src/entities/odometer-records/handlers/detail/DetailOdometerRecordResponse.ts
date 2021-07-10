import IDeserialize from "app/interfaces/deserialize";

export default class DetailOdometerRecordResponse implements IDeserialize
{
    key: number;
    odometerRecordId: number;
    carId: number;
    carIdNumber: string;
    odometerRecordDate: string;
    odometerValue: number;


    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
