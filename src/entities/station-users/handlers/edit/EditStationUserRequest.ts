import {makeAutoObservable} from "mobx";

export default class EditStationUserRequest
{
    stationWorkerId: number;
    stationWorkerFname: string;
    stationWorkerPhone: string;
    stationUserName: string;
    stationUserPassword: string;
    stationId: number;


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
