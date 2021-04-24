import {makeAutoObservable} from "mobx";

export default class DeletePetroStationRequest
{
    public stationId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
