import {makeAutoObservable} from "mobx";

export default class DeleteCarRequest
{
    public carId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
