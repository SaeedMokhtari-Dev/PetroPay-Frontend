import IDeserialize from "app/interfaces/deserialize";

export default class DetailPetroStationResponse implements IDeserialize
{
    key: number;
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

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
