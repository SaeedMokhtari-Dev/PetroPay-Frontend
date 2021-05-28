import {makeAutoObservable} from "mobx";

export default class PaymentPetropayAccountRequest
{
    fromPetroPayAccountId: number;
    toPetroPayAccountId: number;
    amount: number;
    reference: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
