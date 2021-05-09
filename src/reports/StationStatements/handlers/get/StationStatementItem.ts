import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class StationStatementItem implements IDeserialize
{
    key: string;
    invoiceDataTime: string;
    accountId: number;
    stationName: string;
    transDocument: string;
    sumTransAmount: number;
    accountName: string;
    stationId: number;


    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
