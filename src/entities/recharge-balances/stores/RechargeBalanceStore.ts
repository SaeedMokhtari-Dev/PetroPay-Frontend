import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditRechargeBalanceViewModel from "../view-models/EditRechargeBalanceViewModel";
import GetRechargeBalanceViewModel from "../view-models/GetRechargeBalanceViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";
import ListCompanyViewModel from "../../companies/view-models/ListCompanyViewModel";

export default class RechargeBalanceStore
{
    getRechargeBalanceViewModel: GetRechargeBalanceViewModel;
    editRechargeBalanceViewModel: EditRechargeBalanceViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;
    listCompanyViewModel: ListCompanyViewModel;

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
        
        this.listPetropayAccountViewModel = new ListPetropayAccountViewModel();
        this.listCompanyViewModel = new ListCompanyViewModel();
        this.editRechargeBalanceViewModel = new EditRechargeBalanceViewModel(this);
    }

    onRechargeBalanceEditPageUnload()
    {
        this.listPetropayAccountViewModel = null;
        this.editRechargeBalanceViewModel = null;
        this.listCompanyViewModel = null;
    }

}
