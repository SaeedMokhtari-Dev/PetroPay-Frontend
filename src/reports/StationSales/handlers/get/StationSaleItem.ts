import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class StationSaleItem implements IDeserialize
{
    key: number;
    stationWorkerId: number;
    stationWorkerFname: string;
    sumInvoiceAmount: number;
    sumInvoiceFuelConsumptionLiter: number;
    invoiceFuelType: string;
    sumInvoiceDataTime: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
