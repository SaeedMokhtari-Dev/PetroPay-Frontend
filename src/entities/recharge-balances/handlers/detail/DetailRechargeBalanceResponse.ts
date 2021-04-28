import IDeserialize from "app/interfaces/deserialize";

export default class DetailRechargeBalanceResponse implements IDeserialize
{
    key: number;
    rechargeId: number;
    rechageDate: string;
    companyId: number;
    rechargeAmount: number;
    rechargePaymentMethod: string;
    bankName: string;
    bankTransactionDate: string;
    transactionPersonName: string;
    rechargeDocumentPhoto: string;
    rechargeRequstConfirmed: boolean;



    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
