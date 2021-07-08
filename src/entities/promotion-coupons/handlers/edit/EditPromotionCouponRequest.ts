import {makeAutoObservable} from "mobx";

export default class EditPromotionCouponRequest
{
    couponId: number;
    couponCode: string;
    couponDiscountValue: number;
    couponActiveDate: string;
    couponEndDate: string;
    couponActive: boolean;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
