import {makeAutoObservable} from "mobx";

export default class EditPromotionCouponRequest
{
    couponId: number;
    couponCode: string;
    couponDiscountValue: number;
    couponActiveDate: string;
    couponEndDate: string;
    couponActive: boolean;
    companyId: number;
    couponForAllCustomer: boolean;
    couponForMonthly: boolean;
    couponForQuarterly: boolean;
    couponForYearly: boolean;


    constructor(
    ) {
        makeAutoObservable(this);
    }
}
