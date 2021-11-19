import {makeAutoObservable} from "mobx";

export default class EditStationUserRequest
{
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



    constructor(
    ) {
        makeAutoObservable(this);
    }
}
