import {makeAutoObservable} from "mobx";

export default class AddTransferBonusRequest
{
    stationCompanyId: number;
    stationId: number;
    stationWorkerId: number;
    amount: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
