import {makeAutoObservable} from "mobx";

export default class DeletePetrolCompanyRequest
{
    public petrolCompanyId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
