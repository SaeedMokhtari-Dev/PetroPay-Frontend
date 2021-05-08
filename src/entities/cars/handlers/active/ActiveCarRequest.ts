import {makeAutoObservable} from "mobx";

export default class ActiveCarRequest
{
    public carId: number;
    public carNfcCode: string;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
