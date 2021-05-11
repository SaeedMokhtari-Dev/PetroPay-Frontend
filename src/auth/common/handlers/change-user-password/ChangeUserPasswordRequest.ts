import {makeAutoObservable} from "mobx";

export default class ChangeUserPasswordRequest
{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    constructor() {
        makeAutoObservable(this);
    }
}
