import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PetroStationItem implements IDeserialize
{
    key: number;
    /*stationId: number;*/
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
    petrolCompanyId: number;
    petrolCompanyName: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
