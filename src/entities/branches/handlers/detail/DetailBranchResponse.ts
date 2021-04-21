import IDeserialize from "app/interfaces/deserialize";

export default class DetailBranchResponse implements IDeserialize
{
    key: number;
    companyBranchId: number;
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

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
