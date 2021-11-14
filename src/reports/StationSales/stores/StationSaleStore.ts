import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationSaleViewModel from "../view-models/GetStationSaleViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";
import ListStationUserViewModel from "../../../entities/station-users/view-models/ListStationUserViewModel";

export default class StationSaleStore
{
    getStationSaleViewModel: GetStationSaleViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;
    listStationUserViewModel: ListStationUserViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationSaleGetPageLoad()
    {
        this.getStationSaleViewModel = new GetStationSaleViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.listStationUserViewModel = new ListStationUserViewModel();
    }

    onStationSaleGetPageUnload()
    {
        this.getStationSaleViewModel = null;
        this.listPetroStationViewModel = null;
        this.listStationUserViewModel = null;
    }

}
