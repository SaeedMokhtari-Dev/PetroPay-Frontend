import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import CarListItem from "./CarListItem";

export default class ListCarResponse implements IDeserialize
{
    items: CarListItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new CarListItem().deserialize(x));

        return this;
    }
}
