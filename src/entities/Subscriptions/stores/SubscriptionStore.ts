import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditSubscriptionViewModel from "../view-models/EditSubscriptionViewModel";
import GetSubscriptionViewModel from "../view-models/GetSubscriptionViewModel";

export default class SubscriptionStore
{
    getSubscriptionViewModel: GetSubscriptionViewModel;
    editSubscriptionViewModel: EditSubscriptionViewModel;
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
        this.editSubscriptionViewModel = new EditSubscriptionViewModel(this);
    }

    onSubscriptionEditPageUnload()
    {
        this.editSubscriptionViewModel = null;
    }

}
