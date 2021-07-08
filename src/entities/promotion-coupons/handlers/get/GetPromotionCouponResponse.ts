import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import PromotionCouponItem from "./PromotionCouponItem";

export default class GetPromotionCouponResponse implements IDeserialize
{
    items: PromotionCouponItem[] = [];
    totalCount: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.items = this.items.map(x => new PromotionCouponItem().deserialize(x));
        this.totalCount = this.totalCount;

        return this;
    }
}
