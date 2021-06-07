import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationSaleViewModel from "../view-models/GetStationSaleViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";

export default class StationSaleStore
{
    getStationSaleViewModel: GetStationSaleViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationSaleGetPageLoad()
    {
        this.getStationSaleViewModel = new GetStationSaleViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
    }

    onStationSaleGetPageUnload()
    {
        this.getStationSaleViewModel = null;
        this.listPetroStationViewModel = null;
    }

}
