import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditNewCustomerViewModel from "../view-models/EditNewCustomerViewModel";
import GetNewCustomerViewModel from "../view-models/GetNewCustomerViewModel";

export default class NewCustomerStore
{
    getNewCustomerViewModel: GetNewCustomerViewModel;
    editNewCustomerViewModel: EditNewCustomerViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onNewCustomerGetPageLoad()
    {
        this.getNewCustomerViewModel = new GetNewCustomerViewModel(this);
    }

    onNewCustomerGetPageUnload()
    {
        this.getNewCustomerViewModel = null;
    }

    onNewCustomerEditPageLoad()
    {
        this.editNewCustomerViewModel = new EditNewCustomerViewModel(this);
    }

    onNewCustomerEditPageUnload()
    {
        this.editNewCustomerViewModel = null;
    }

}
