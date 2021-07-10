import {makeAutoObservable} from "mobx";

export default class EditOdometerRecordRequest
{
    odometerRecordId: number;
    carId: number;
    odometerRecordDate: string;
    odometerValue: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
