import {makeAutoObservable} from "mobx";

export default class DeleteBranchRequest
{
    public branchId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
