import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditPromotionCouponViewModel from "../view-models/EditPromotionCouponViewModel";
import GetPromotionCouponViewModel from "../view-models/GetPromotionCouponViewModel";

export default class PromotionCouponStore
{
    getPromotionCouponViewModel: GetPromotionCouponViewModel;
    editPromotionCouponViewModel: EditPromotionCouponViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPromotionCouponGetPageLoad()
    {
        this.getPromotionCouponViewModel = new GetPromotionCouponViewModel(this);
    }

    onPromotionCouponGetPageUnload()
    {
        this.getPromotionCouponViewModel = null;
    }

    onPromotionCouponEditPageLoad()
    {
        this.editPromotionCouponViewModel = new EditPromotionCouponViewModel(this);
    }

    onPromotionCouponEditPageUnload()
    {
        this.editPromotionCouponViewModel = null;
    }

}
