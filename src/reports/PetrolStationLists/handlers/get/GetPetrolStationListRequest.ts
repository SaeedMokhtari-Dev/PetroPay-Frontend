import { makeAutoObservable } from "mobx";

export default class GetPetrolStationListRequest
{
    region: string;
    exportToFile: boolean;

    pageIndex: number;
    pageSize: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
