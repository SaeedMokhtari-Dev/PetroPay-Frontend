import {makeAutoObservable} from "mobx";

export default class AddOdometerRecordRequest
{
    carId: number;
    odometerRecordDate: string;
    odometerValue: number;


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
