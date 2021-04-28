import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditRechargeBalanceViewModel from "../view-models/EditRechargeBalanceViewModel";
import GetRechargeBalanceViewModel from "../view-models/GetRechargeBalanceViewModel";

export default class RechargeBalanceStore
{
    getRechargeBalanceViewModel: GetRechargeBalanceViewModel;
    editRechargeBalanceViewModel: EditRechargeBalanceViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onRechargeBalanceGetPageLoad()
    {
        this.getRechargeBalanceViewModel = new GetRechargeBalanceViewModel(this);
    }

    onRechargeBalanceGetPageUnload()
    {
        this.getRechargeBalanceViewModel = null;
    }

    onRechargeBalanceEditPageLoad()
    {
        this.editRechargeBalanceViewModel = new EditRechargeBalanceViewModel(this);
    }

    onRechargeBalanceEditPageUnload()
    {
        this.editRechargeBalanceViewModel = null;
    }

}
