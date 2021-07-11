import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import MenuTreeItem from "./MenuTreeItem";

export default class TreeMenuResponse implements IDeserialize
{
    key: string;
    arTitle: string;
    enTitle: string;

    items: MenuTreeItem[];

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new MenuTreeItem().deserialize(x));

        return this;
    }
}
