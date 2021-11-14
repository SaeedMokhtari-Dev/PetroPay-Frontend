import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PetrolCompanyItem implements IDeserialize
{
    key: number;
    /*petrolCompanyId: number;*/
    petrolCompanyName: string;
    petrolCompanyCommercialNumber: string;
    petrolCompanyType: string;
    petrolCompanyAdminUserName: string;
    petrolCompanyAdminUserPassword: string;
    petrolCompanyCountry: string;
    petrolCompanyRegion: string;
    petrolCompanyAddress: string;
    petrolCompanyAdminName: string;
    petrolCompanyAdminPosition: string;
    petrolCompanyAdminPhone: string;
    petrolCompanyAdminEmail: string;
    petrolCompanyBalnce: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
