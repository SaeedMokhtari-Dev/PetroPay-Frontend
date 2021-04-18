import IDeserialize from "../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CompanyItem implements IDeserialize
{
    key: number;
    /*companyId: number;*/
    companyName: string;
    companyCommercialNumber: string;
    companyType: string;
    companyAdminUserName: string;
    companyAdminUserPassword: string;
    companyCountry: string;
    companyRegion: string;
    companyAddress: string;
    companyAdminName: string;
    companyAdminPosition: string;
    companyAdminPhone: string;
    companyAdminEmail: string;
    companyBalnce: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
