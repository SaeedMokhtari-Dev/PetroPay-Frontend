import IDeserialize from "app/interfaces/deserialize";

export default class DetailCompanyResponse implements IDeserialize
{
    companyId: number;
    companyName: string;
    companyCommercialNumber: string;
    companyCommercialPhoto: string;
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

    companyVatNumber: string;
    companyVatPhoto: string;
    companyTaxNumber: string;
    companyTaxPhoto: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
