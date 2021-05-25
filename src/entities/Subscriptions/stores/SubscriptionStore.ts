import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditSubscriptionViewModel from "../view-models/EditSubscriptionViewModel";
import GetSubscriptionViewModel from "../view-models/GetSubscriptionViewModel";
import ListBundleViewModel from "../../bundles/view-models/ListBundleViewModel";
import ListPetropayAccountViewModel from "../../PetropayAccounts/view-models/ListPetropayAccountViewModel";
import ListCarViewModel from "../../cars/view-models/ListCarViewModel";


export default class SubscriptionStore
{
    getSubscriptionViewModel: GetSubscriptionViewModel;
    editSubscriptionViewModel: EditSubscriptionViewModel;
    listBundleViewModel: ListBundleViewModel;
    listPetropayAccountViewModel: ListPetropayAccountViewModel;
    listCarViewModel: ListCarViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onSubscriptionGetPageLoad()
    {
        this.getSubscriptionViewModel = new GetSubscriptionViewModel(this);
    }

    onSubscriptionGetPageUnload()
    {
        this.getSubscriptionViewModel = null;
    }

    onSubscriptionEditPageLoad()
    {
        this.listPetropayAccountViewModel = new ListPetropayAccountViewModel();
        this.editSubscriptionViewModel = new EditSubscriptionViewModel(this);
        this.listBundleViewModel = new ListBundleViewModel();
    }

    onSubscriptionEditPageUnload()
    {
        this.editSubscriptionViewModel = null;
        this.listBundleViewModel = null;
        this.listPetropayAccountViewModel = null;
    }
    onCarAddSubscriptionPageLoad()
    {
        this.listCarViewModel = new ListCarViewModel();
        this.editSubscriptionViewModel = new EditSubscriptionViewModel(this);
    }

    onCarAddSubscriptionPageUnload()
    {
        this.editSubscriptionViewModel = null;
        this.listCarViewModel = null;
    }

}
