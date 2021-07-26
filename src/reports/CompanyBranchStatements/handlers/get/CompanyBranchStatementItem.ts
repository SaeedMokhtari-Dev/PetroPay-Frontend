import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CompanyBranchStatementItem implements IDeserialize
{
    key: string;
    transactionDateTime: string;
    accountId: number;
    companyId: number;
    companyName: string;
    companyBranchId: number;
    companyBranchName: string;
    sumTransAmount: number;
    transDocument: string;


    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
