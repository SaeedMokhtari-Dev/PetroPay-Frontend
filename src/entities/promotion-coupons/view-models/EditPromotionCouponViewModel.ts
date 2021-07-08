import {makeAutoObservable} from "mobx";
import DetailPromotionCouponResponse from "../handlers/detail/DetailPromotionCouponResponse";
import GetPromotionCouponHandler from "../handlers/get/GetPromotionCouponHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailPromotionCouponHandler from "../handlers/detail/DetailPromotionCouponHandler";
import DetailPromotionCouponRequest from "../handlers/detail/DetailPromotionCouponRequest";
import AddPromotionCouponRequest from "../handlers/add/AddPromotionCouponRequest";
import EditPromotionCouponRequest from "../handlers/edit/EditPromotionCouponRequest";
import AddPromotionCouponHandler from "../handlers/add/AddPromotionCouponHandler";
import {message} from "antd";
import GetPromotionCouponRequest from "../handlers/get/GetPromotionCouponRequest";
import EditPromotionCouponHandler from "../handlers/edit/EditPromotionCouponHandler";
import PromotionCouponStore from "../stores/PromotionCouponStore";

export default class EditPromotionCouponViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailPromotionCouponResponse: DetailPromotionCouponResponse;
    addPromotionCouponRequest: AddPromotionCouponRequest;
    editPromotionCouponRequest: EditPromotionCouponRequest;

    constructor(public promotionCouponsStore: PromotionCouponStore) {
        makeAutoObservable(this);
    }
    public async getDetailPromotionCoupon(promotionCouponId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailPromotionCouponRequest(promotionCouponId);
            let response = await DetailPromotionCouponHandler.detail(request);

            if(response && response.success)
            {

                this.detailPromotionCouponResponse = new DetailPromotionCouponResponse().deserialize(response.data);
                this.editPromotionCouponRequest = new EditPromotionCouponRequest();
                for ( let i in this.editPromotionCouponRequest )
                    if ( this.detailPromotionCouponResponse.hasOwnProperty( i ) )
                        this.editPromotionCouponRequest[i] = this.detailPromotionCouponResponse[i];


                return this.detailPromotionCouponResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PromotionCoupons.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addPromotionCoupon(request: AddPromotionCouponRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddPromotionCouponHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.promotionCouponsStore.getPromotionCouponViewModel.getAllPromotionCoupons(new GetPromotionCouponsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PromotionCoupons.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editPromotionCoupon(request: EditPromotionCouponRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditPromotionCouponHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.promotionCouponsStore.getPromotionCouponViewModel.getAllPromotionCoupons(new GetPromotionCouponsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PromotionCoupons.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
