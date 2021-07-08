import {makeAutoObservable} from "mobx";

export default class AddPromotionCouponRequest
{
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
