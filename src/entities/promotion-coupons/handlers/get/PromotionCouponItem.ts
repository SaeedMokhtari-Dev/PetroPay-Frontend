import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class PromotionCouponItem implements IDeserialize
{
    key: number;
    couponCode: string;
    couponDiscountValue: number;
    couponActiveDate: string;
    couponEndDate: string;
    couponActive: boolean;
    userId: number;
    userName: string;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
