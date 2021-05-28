import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCustomerViewModel from "../view-models/GetCustomerViewModel";

export default class CustomerStore
{
    getCustomerViewModel: GetCustomerViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCustomerGetPageLoad()
    {
        this.getCustomerViewModel = new GetCustomerViewModel(this);
    }

    onCustomerGetPageUnload()
    {
        this.getCustomerViewModel = null;
    }

}
