import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationSaleViewModel from "../view-models/GetStationSaleViewModel";

export default class StationSaleStore
{
    getStationSaleViewModel: GetStationSaleViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationSaleGetPageLoad()
    {
        this.getStationSaleViewModel = new GetStationSaleViewModel(this);
    }

    onStationSaleGetPageUnload()
    {
        this.getStationSaleViewModel = null;
    }

}
