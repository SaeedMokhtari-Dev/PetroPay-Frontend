import {makeAutoObservable} from "mobx";

export default class EditPetroStationRequest
{
    stationId: number;
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
    stationEmail: number;
    stationServiceActive: boolean;
    stationServiceDeposit: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
