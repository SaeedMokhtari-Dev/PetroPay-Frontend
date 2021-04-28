import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class RechargeBalanceItem implements IDeserialize
{
    key: number;
    /*rechargeId: number;*/
    rechageDate: string;
    companyId: number;
    rechargeAmount: number;
    rechargePaymentMethod: string;
    bankName: string;
    bankTransactionDate: string;
    transactionPersonName: string;
    rechargeDocumentPhoto: string;
    rechargeRequstConfirmed: boolean;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
