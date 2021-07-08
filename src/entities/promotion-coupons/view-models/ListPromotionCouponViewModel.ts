import PromotionCouponItem from "../handlers/get/PromotionCouponItem";

import {makeAutoObservable} from "mobx";
import GetPromotionCouponRequest from "../handlers/get/GetPromotionCouponRequest";
import GetPromotionCouponHandler from "../handlers/get/GetPromotionCouponHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class ListPromotionCouponViewModel {
    promotionCouponList: PromotionCouponItem[];
    isProcessing: boolean;
    errorMessage: string;

    constructor() {
        makeAutoObservable(this);
    }

    public async getAllPromotionCoupons() {
        try {
            this.isProcessing = true;
            const getPromotionCouponsRequest: GetPromotionCouponRequest = new GetPromotionCouponRequest(10000, 0);

            let response = await GetPromotionCouponHandler.get(getPromotionCouponsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.promotionCouponList = items;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PromotionCoupons.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
