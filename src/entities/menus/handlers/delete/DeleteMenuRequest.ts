import {makeAutoObservable} from "mobx";

export default class DeleteMenuRequest
{
    public menuId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
