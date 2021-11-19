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
    companyId: number;
    couponForAllCustomer: boolean;
    couponForMonthly: boolean;
    couponForQuarterly: boolean;
    couponForYearly: boolean;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
