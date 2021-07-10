import {makeAutoObservable} from "mobx";

export default class EditAppSettingRequest
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


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
