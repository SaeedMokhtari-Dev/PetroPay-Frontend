import {makeAutoObservable} from "mobx";

export default class DeleteOdometerRecordRequest
{
    public odometerRecordId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
