import {makeAutoObservable} from "mobx";

export default class EditMenuRequest
{
    menuId: number;
    arTitle: string;
    urlRoute: string;
    displayOrder: number;
    isActive: boolean;
    parentId: number;
    enTitle: string;


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
