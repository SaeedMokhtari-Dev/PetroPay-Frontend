import {makeAutoObservable} from "mobx";

export default class ActiveBranchRequest
{
    public branchId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
