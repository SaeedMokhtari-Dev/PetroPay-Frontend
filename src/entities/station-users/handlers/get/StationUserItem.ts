import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class StationUserItem implements IDeserialize
{
    key: number;
    /*stationWorkerId: number;*/
    stationWorkerFname: string;
    stationWorkerPhone: string;
    stationUserName: string;
    stationUserPassword: string;
    stationId: number;
    stationName: string;
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



    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
