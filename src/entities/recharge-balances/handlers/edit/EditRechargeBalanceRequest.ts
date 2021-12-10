import {makeAutoObservable} from "mobx";

export default class EditRechargeBalanceRequest
{
    rechargeId: number;
    rechargeAmount: number;
    rechargePaymentMethod: string;
    bankName: string;
    bankTransactionDate: string;
    transactionPersonName: string;
    rechargeDocumentPhoto: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
