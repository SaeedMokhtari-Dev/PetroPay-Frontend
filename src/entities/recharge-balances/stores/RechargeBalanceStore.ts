import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditRechargeBalanceViewModel from "../view-models/EditRechargeBalanceViewModel";
import GetRechargeBalanceViewModel from "../view-models/GetRechargeBalanceViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";

export default class RechargeBalanceStore
{
    getRechargeBalanceViewModel: GetRechargeBalanceViewModel;
    editRechargeBalanceViewModel: EditRechargeBalanceViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;

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
        debugger;
        this.listPetropayAccountViewModel = new ListPetropayAccountViewModel();
        this.editRechargeBalanceViewModel = new EditRechargeBalanceViewModel(this);
    }

    onRechargeBalanceEditPageUnload()
    {
        this.listPetropayAccountViewModel = null;
        this.editRechargeBalanceViewModel = null;
    }

}
