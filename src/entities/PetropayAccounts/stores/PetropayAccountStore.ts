import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import PaymentPetropayAccountViewModel from "../view-models/PaymentPetropayAccountViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";

export default class PetropayAccountStore
{
    paymentPetropayAccountViewModel: PaymentPetropayAccountViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetropayAccountPaymentPageLoad()
    {
        this.paymentPetropayAccountViewModel = new PaymentPetropayAccountViewModel(this);
        this.listPetropayAccountViewModel = new ListPetropayAccountViewModel();
    }

    onPetropayAccountPaymentPageUnload()
    {
        this.paymentPetropayAccountViewModel = null;
        this.listPetropayAccountViewModel = null;
    }

}
