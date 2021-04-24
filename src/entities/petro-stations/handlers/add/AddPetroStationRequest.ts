import {makeAutoObservable} from "mobx";

export default class AddPetroStationRequest
{
    stationName: string;
    stationAddress: string;
    stationLucationName: string;
    stationOwnerName: string;
    stationPhone: string;
    stationBanckAccount: string;
    stationLatitude: number;
    stationLongitude: number;
    stationUserName: string;
    stationPassword: string;
    stationNameAr: string;
    stationDiesel: boolean;
    stationBalance: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
