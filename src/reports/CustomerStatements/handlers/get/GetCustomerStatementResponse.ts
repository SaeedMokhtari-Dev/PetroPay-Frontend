import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CustomerStatementItem from "./CustomerStatementItem";

export default class GetCustomerStatementResponse implements IDeserialize
{
    items: CustomerStatementItem[] = [];
    totalCount: number;
    sumCustomerStatement: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CustomerStatementItem().deserialize(x));
        this.totalCount = this.totalCount;
        this.sumCustomerStatement = this.sumCustomerStatement;

        return this;
    }
}
