import { makeAutoObservable } from "mobx";

export default class GetOdometerBetweenDateRequest
{
    carId?: number;
    dateTimeFrom: string;
    dateTimeTo: string;
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
