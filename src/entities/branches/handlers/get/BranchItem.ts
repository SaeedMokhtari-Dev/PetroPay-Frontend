import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class BranchItem implements IDeserialize
{
    key: number;
    /*companyBranchId: number;*/
    companyBranchName: string;
    companyBranchNumberOfcar: number;
    companyBranchAddress: string;
    companyBranchActiva: boolean;
    companyId: number;
    companyBranchBalnce: number;
    companyBranchAdminName: string;
    companyBranchAdminUserName: string;
    companyBranchAdminPhone: string;
    companyBranchAdminUserPassword: string;
    companyBranchAdminEmail: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
