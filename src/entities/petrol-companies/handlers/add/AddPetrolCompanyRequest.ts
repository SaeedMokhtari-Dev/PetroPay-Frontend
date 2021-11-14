import {makeAutoObservable} from "mobx";

export default class AddPetrolCompanyRequest
{
    petrolCompanyName: string;
    petrolCompanyCommercialNumber: string;
    petrolCompanyCommercialPhoto: string;
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

    petrolCompanyVatNumber: string;
    petrolCompanyVatPhoto: string;
    petrolCompanyTaxNumber: string;
    petrolCompanyTaxPhoto: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
