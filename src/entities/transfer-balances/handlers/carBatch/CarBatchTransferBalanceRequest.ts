import {makeAutoObservable} from "mobx";
import CarAmount from "./CarAmount";

export default class CarBatchTransferBalanceRequest
{
    branchId: number;
    carAmounts: CarAmount[] = [];

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
