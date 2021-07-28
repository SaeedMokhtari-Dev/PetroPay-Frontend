import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarModelMasterListItem implements IDeserialize
{
    key: string;
    titleAr: string;
    titleEn: string;
    brandId: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
