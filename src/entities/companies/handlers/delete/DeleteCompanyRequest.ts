import {makeAutoObservable} from "mobx";

export default class DeleteCompanyRequest
{
    public companyId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
