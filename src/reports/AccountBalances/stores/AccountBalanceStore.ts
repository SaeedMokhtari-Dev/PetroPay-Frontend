import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetAccountBalanceViewModel from "../view-models/GetAccountBalanceViewModel";

export default class AccountBalanceStore
{
    getAccountBalanceViewModel: GetAccountBalanceViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onAccountBalanceGetPageLoad()
    {
        this.getAccountBalanceViewModel = new GetAccountBalanceViewModel(this);
    }

    onAccountBalanceGetPageUnload()
    {
        this.getAccountBalanceViewModel = null;
    }

}
