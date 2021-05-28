import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditPetroStationViewModel from "../view-models/EditPetroStationViewModel";
import GetPetroStationViewModel from "../view-models/GetPetroStationViewModel";
import PaymentPetroStationViewModel from "../view-models/PaymentPetroStationViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";

export default class PetroStationStore
{
    getPetroStationViewModel: GetPetroStationViewModel;
    editPetroStationViewModel: EditPetroStationViewModel;
    paymentPetroStationViewModel: PaymentPetroStationViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;

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
    }

    onPetroStationEditPageUnload()
    {
        this.editPetroStationViewModel = null;
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
