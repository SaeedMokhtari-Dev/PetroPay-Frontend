import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CustomerItem from "./CompanySubscriptionItem";
import CompanyBranchItem from "./CompanyBranchItem";
import CompanySubscriptionItem from "./CompanySubscriptionItem";

export default class GetCustomerResponse implements IDeserialize
{
    companyBranchItems: CompanyBranchItem[] = [];
    companySubscriptionItems: CompanySubscriptionItem[] = [];
    totalCustomerBalance: number;
    totalBranchBalance: number;
    totalCarBalance: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.companyBranchItems = this.companyBranchItems.map(x => new CompanyBranchItem().deserialize(x));
        this.companySubscriptionItems =
            this.companySubscriptionItems.map(x => new CompanySubscriptionItem().deserialize(x));

        return this;
    }
}
