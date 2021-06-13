import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import PaymentPetropayAccountViewModel from "../view-models/PaymentPetropayAccountViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";
import GetPetropayAccountViewModel from "../view-models/GetPetropayAccountViewModel";

export default class PetropayAccountStore
{
    paymentPetropayAccountViewModel: PaymentPetropayAccountViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;
    getPetropayAccountViewModel: GetPetropayAccountViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetropayAccountGetPageLoad()
    {
        this.getPetropayAccountViewModel = new GetPetropayAccountViewModel(this);
    }

    onPetropayAccountGetPageUnload()
    {
        this.getPetropayAccountViewModel = null;
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
