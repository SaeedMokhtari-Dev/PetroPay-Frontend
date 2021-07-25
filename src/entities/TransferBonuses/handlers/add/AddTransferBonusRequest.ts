import {makeAutoObservable} from "mobx";

export default class AddTransferBonusRequest
{
    stationId: number;
    amount: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
