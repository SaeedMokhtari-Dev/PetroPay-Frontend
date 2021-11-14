import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditPetroStationViewModel from "../view-models/EditPetroStationViewModel";
import GetPetroStationViewModel from "../view-models/GetPetroStationViewModel";
import PaymentPetroStationViewModel from "../view-models/PaymentPetroStationViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";
import ListPetrolCompanyViewModel from "../../petrol-companies/view-models/ListPetrolCompanyViewModel";

export default class PetroStationStore
{
    getPetroStationViewModel: GetPetroStationViewModel;
    editPetroStationViewModel: EditPetroStationViewModel;
    paymentPetroStationViewModel: PaymentPetroStationViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;
    listPetrolCompanyViewModel: ListPetrolCompanyViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetroStationGetPageLoad()
    {
        this.getPetroStationViewModel = new GetPetroStationViewModel(this);
    }

    onPetroStationGetPageUnload()
    {
        this.getPetroStationViewModel = null;
    }

    onPetroStationEditPageLoad()
    {
        this.editPetroStationViewModel = new EditPetroStationViewModel(this);
        this.listPetrolCompanyViewModel = new ListPetrolCompanyViewModel();
    }

    onPetroStationEditPageUnload()
    {
        this.editPetroStationViewModel = null;
        this.listPetrolCompanyViewModel = null;
    }

    onPetroStationPaymentPageLoad()
    {
        this.paymentPetroStationViewModel = new PaymentPetroStationViewModel(this);
        this.listPetropayAccountViewModel = new ListPetropayAccountViewModel();
    }

    onPetroStationPaymentPageUnload()
    {
        this.paymentPetroStationViewModel = null;
        this.listPetropayAccountViewModel = null;
    }

}
