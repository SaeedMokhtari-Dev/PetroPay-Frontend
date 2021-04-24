import IDeserialize from "app/interfaces/deserialize";

export default class DetailStationUserResponse implements IDeserialize
{
    key: number;
    stationWorkerId: number;
    stationWorkerFname: string;
    stationWorkerPhone: string;
    stationUserName: string;
    stationUserPassword: string;
    stationId: number;


    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
