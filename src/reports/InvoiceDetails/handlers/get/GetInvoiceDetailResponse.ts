import IDeserialize from "app/interfaces/deserialize";

export default class GetInvoiceDetailResponse implements IDeserialize
{
    invoiceId: number;
    invoiceDataTime: string;
    invoicePayType: string;
    invoicePayStatus: string;
    serviceEnDescription: string;
    serviceArDescription: string;
    stationName: string;
    stationNameAr: string;
    invoicePumpPhoto: string;
    invoicePlatePhoto: string;
    stationLatitude: number;
    stationLongitude: number;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
