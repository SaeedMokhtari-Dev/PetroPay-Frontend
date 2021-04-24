import {makeAutoObservable} from "mobx";

export default class DeleteStationUserRequest
{
    public stationWorkerId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
