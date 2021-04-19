import {makeAutoObservable} from "mobx";

export default class DeleteBundleRequest
{
    public bundlesId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
