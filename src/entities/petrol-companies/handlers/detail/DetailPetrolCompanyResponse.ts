import IDeserialize from "app/interfaces/deserialize";

export default class DetailPetrolCompanyResponse implements IDeserialize
{
    petrolCompanyId: number;
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

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
