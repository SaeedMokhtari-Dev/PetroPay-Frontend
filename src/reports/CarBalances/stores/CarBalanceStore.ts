import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarBalanceViewModel from "../view-models/GetCarBalanceViewModel";

export default class CarBalanceStore
{
    getCarBalanceViewModel: GetCarBalanceViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarBalanceGetPageLoad()
    {
        this.getCarBalanceViewModel = new GetCarBalanceViewModel(this);
    }

    onCarBalanceGetPageUnload()
    {
        this.getCarBalanceViewModel = null;
    }

}
