import IDeserialize from "app/interfaces/deserialize";

export default class DetailAppSettingResponse implements IDeserialize
{
    companyNameEn: string;
    companyNameAr: string;
    companyAddress: string;
    companyEmail: string;
    companyCommercialRecordNumber: string;
    companyVatTaxNumber: string;
    companyVatRate: number;
    comapnyTaxRecordNumber: string;
    companyLogo: string;
    companyStampImage: string;
    comapnyTaxRate: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}