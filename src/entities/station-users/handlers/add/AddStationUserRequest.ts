import {makeAutoObservable} from "mobx";

export default class AddStationUserRequest
{
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
