import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class InvoiceSummaryItem implements IDeserialize
{
    key: string;
    invoiceId: number;
    companyBranchId: number;
    companyBranchName: string;
    invoiceDataTime: string;
    serviceEnDescription: string;
    serviceArDescription: string;
    carIdNumber: string;
    invoiceFuelConsumptionLiter: number;
    invoiceAmount: number;
    paymentMethodName: string;
    companyId: number;
    companyName: string;
    invoiceOdometer: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
