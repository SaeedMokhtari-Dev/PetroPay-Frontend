import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CompanyBranchStatementItem from "./CompanyBranchStatementItem";

export default class GetCompanyBranchStatementResponse implements IDeserialize
{
    items: CompanyBranchStatementItem[] = [];
    totalCount: number;
    sumCompanyBranchStatement: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CompanyBranchStatementItem().deserialize(x));
        this.totalCount = this.totalCount;
        this.sumCompanyBranchStatement = this.sumCompanyBranchStatement;

        return this;
    }
}
