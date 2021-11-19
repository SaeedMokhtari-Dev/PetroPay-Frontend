import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditPromotionCouponViewModel from "../view-models/EditPromotionCouponViewModel";
import GetPromotionCouponViewModel from "../view-models/GetPromotionCouponViewModel";
import ListCompanyViewModel from "../../companies/view-models/ListCompanyViewModel";

export default class PromotionCouponStore
{
    getPromotionCouponViewModel: GetPromotionCouponViewModel;
    editPromotionCouponViewModel: EditPromotionCouponViewModel;
    listCompanyViewModel: ListCompanyViewModel;
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
        this.listCompanyViewModel = new ListCompanyViewModel();
    }

    onPromotionCouponEditPageUnload()
    {
        this.editPromotionCouponViewModel = null;
        this.listCompanyViewModel = null;
    }

}
