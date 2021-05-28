import {makeAutoObservable} from "mobx";

export default class PaymentPetroStationRequest
{
    stationId: number;
    petroPayAccountId: number;
    amount: number;
    reference: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
