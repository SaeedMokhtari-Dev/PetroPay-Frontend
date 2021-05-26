import {makeAutoObservable} from "mobx";

export default class AddTransferBalanceRequest
{
    transferBalanceType: number;
    companyId: number;
    branchId: number;
    carId: number;
    destinationCarId: number;
    amount: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
