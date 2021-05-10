import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarTransactionViewModel from "../view-models/GetCarTransactionViewModel";

export default class CarTransactionStore
{
    getCarTransactionViewModel: GetCarTransactionViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarTransactionGetPageLoad()
    {
        this.getCarTransactionViewModel = new GetCarTransactionViewModel(this);
    }

    onCarTransactionGetPageUnload()
    {
        this.getCarTransactionViewModel = null;
    }

}
