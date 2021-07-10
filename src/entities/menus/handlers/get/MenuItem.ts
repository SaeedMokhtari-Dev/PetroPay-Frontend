import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class MenuItem implements IDeserialize
{
    key: number;
    menuId: number;
    arTitle: string;
    createdAt: string;
    urlRoute: string;
    displayOrder: number;
    isActive: boolean;
    parentId: number;
    parentTitleAr: string;
    parentTitleEn: string;
    enTitle: string;


    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
