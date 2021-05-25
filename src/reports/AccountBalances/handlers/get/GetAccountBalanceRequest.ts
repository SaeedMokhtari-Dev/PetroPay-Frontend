import { makeAutoObservable } from "mobx";

export default class GetAccountBalanceRequest
{
    pageIndex: number;
    pageSize: number;
    exportToFile: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
