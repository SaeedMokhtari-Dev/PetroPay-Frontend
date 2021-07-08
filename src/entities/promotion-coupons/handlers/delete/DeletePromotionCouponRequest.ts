import {makeAutoObservable} from "mobx";

export default class DeletePromotionCouponRequest
{
    public promotionCouponsId: number;

    constructor(
    ) {
        makeAutoObservable(this);
    }
}
