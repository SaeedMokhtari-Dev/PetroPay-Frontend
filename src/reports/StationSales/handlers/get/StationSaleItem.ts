import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class StationSaleItem implements IDeserialize
{
    key: string;
    stationWorkerId: number;
    stationWorkerFname: string;
    sumInvoiceAmount: number;
    sumInvoiceFuelConsumptionLiter: number;
    invoiceFuelType: string;
    sumInvoiceDataTime: string;
    sumInvoiceBonusPoints: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
