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
    accessStationBalance: boolean;
    accessBonusTransfer: boolean;
    accessStationBonusBalance: boolean;
    accessAppReport: boolean;
    accessFuelingApp: boolean;
    accessChangeOilApp: boolean;
    accessCarWasherApp: boolean;
    accessChangeTyreApp: boolean;
    accessTemp1: boolean;
    accessTemp2: boolean;
    accessTemp3: boolean;



    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
