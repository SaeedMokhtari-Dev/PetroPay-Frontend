import {makeAutoObservable} from "mobx";

export default class AddBranchRequest
{
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

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
