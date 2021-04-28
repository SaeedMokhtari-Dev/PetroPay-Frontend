import {makeAutoObservable} from "mobx";

export default class EditRechargeBalanceRequest
{
    rechargeId: number;
    rechageDate: string;
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
