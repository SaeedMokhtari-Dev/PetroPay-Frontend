import PromotionCouponItem from "../handlers/get/PromotionCouponItem";

import PromotionCouponsStore from "../stores/PromotionCouponStore";
import {makeAutoObservable} from "mobx";
import GetPromotionCouponRequest from "../handlers/get/GetPromotionCouponRequest";
import GetPromotionCouponHandler from "../handlers/get/GetPromotionCouponHandler";
import GetPromotionCouponResponse from "../handlers/get/GetPromotionCouponResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeletePromotionCouponHandler from "../handlers/delete/DeletePromotionCouponHandler";
import DeletePromotionCouponRequest from "../handlers/delete/DeletePromotionCouponRequest";
import {message} from "antd";

export default class GetPromotionCouponViewModel {
    columns: any[];
    promotionCouponList: PromotionCouponItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    constructor(public promotionCouponsStore: PromotionCouponsStore) {
        makeAutoObservable(this);

    }

    public async getAllPromotionCoupons(getPromotionCouponsRequest: GetPromotionCouponRequest) {
        try {
            this.isProcessing = true;
            let response = await GetPromotionCouponHandler.get(getPromotionCouponsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.promotionCouponList = items;
                this.totalSize = result.totalCount;
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
    public async deletePromotionCoupon(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeletePromotionCouponRequest();
            request.promotionCouponsId = key;
            let response = await DeletePromotionCouponHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllPromotionCoupons(new GetPromotionCouponRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PromotionCoupons.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
