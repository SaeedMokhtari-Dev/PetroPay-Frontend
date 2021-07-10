import IDeserialize from "app/interfaces/deserialize";

export default class DetailMenuResponse implements IDeserialize
{
    menuId: number;
    arTitle: string;
    urlRoute: string;
    displayOrder: number;
    isActive: boolean;
    parentId: number;
    enTitle: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
