import { makeAutoObservable } from "mobx";

export default class GetCarKmConsumptionRequest
{
    carId?: number;
    /*carIdNumber: string;
    companyBranchId: number;
    companyBranchName: string;*/
    /*transDateFrom: string;
    transDateTo: string;*/
    /*companyId: number;*/
    /*companyName: string;*/
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
