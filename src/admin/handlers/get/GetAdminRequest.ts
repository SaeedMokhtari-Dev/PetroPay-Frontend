import { makeAutoObservable } from "mobx";

export default class GetAdminRequest
{
    constructor(
    ) {
        makeAutoObservable(this);
    }
}
