import IDeserialize from "app/interfaces/deserialize";

export default class DetailCarResponse implements IDeserialize
{
    key: number;
    carId: number;
    carIdNumber: string;
    carIdText1E: string;
    carIdText1A: string;
    carIdNumber1E: string;
    consumptionType: string;
    consumptionValue: number;
    consumptionMethod: string;
    companyBarnchId: number;
    carBalnce: number;
    saturday: boolean;
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    carType: string;
    carBrand: string;
    carModel: string;
    carModelYear: number;
    carTypeOfFuel: string;
    carNeedPlatePhoto: boolean;
    carDriverName: string;
    carDriverPhoneNumber: string;
    carDriverUserName: string;
    carDriverPassword: string;
    carDriverEmail: string;
    carDriverActive: boolean;
    carDriverConfirmationCode: string;
    carPlatePhoto: string;
    carWorkWithApproval: boolean;
    carApprovedOneTime: boolean;
    workAllDays: boolean;
    carNfcCode: string;


    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
