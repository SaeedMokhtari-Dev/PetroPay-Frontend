import IDeserialize from "app/interfaces/deserialize";

export default class InvoiceSubscriptionResponse implements IDeserialize
{
    invoiceNumber: number;
    dateOfIssue: string;
    companyLogo: string;
    companyNameEn: string;
    companyNameAr: string;
    companyAddress: string;
    companyTaxRecordNumber: string;
    companyCommercialRecordNumber: string;
    companyEmail: string;
    companyWebsite: string;
    customerName: string;
    customerAddress: string;
    serviceDescription: string;
    unitCost: number;
    quantity: number;
    amount: number;
    serviceStartDate: string;
    serviceEndDate: string;
    subTotal: number;
    discount: number;
    taxRate: number;
    tax: number;
    vatRate: number;
    vat: number;
    total: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
