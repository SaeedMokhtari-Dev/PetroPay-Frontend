import {makeAutoObservable} from "mobx";

export default class AddPromotionCouponRequest
{
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
