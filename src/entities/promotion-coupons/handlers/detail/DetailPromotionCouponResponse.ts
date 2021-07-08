import IDeserialize from "app/interfaces/deserialize";

export default class DetailPromotionCouponResponse implements IDeserialize
{
    couponId: number;
    couponCode: string;
    couponDiscountValue: number;
    couponActiveDate: string;
    couponEndDate: string;
    couponActive: boolean;
    userId: number;
    userName: string;

    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
