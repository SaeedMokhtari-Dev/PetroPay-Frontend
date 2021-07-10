import {makeAutoObservable} from "mobx";

export default class AddMenuRequest
{
    enTitle: string;
    arTitle: string;
    urlRoute: string;
    displayOrder: number;
    isActive: boolean;
    parentId: number;



    constructor(
    ) {
        makeAutoObservable(this);
    }
}
