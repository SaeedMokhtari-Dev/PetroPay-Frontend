import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationSaleViewModel from "../view-models/GetStationSaleViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";
import ListStationUserViewModel from "../../../entities/station-users/view-models/ListStationUserViewModel";
import ListServiceMasterViewModel from "../../../entities/ServiceMasters/view-models/ListServiceMasterViewModel";
import ListPetrolPriceViewModel from "../../../entities/PetrolPrices/view-models/ListPetrolPriceViewModel";

export default class StationSaleStore
{
    getStationSaleViewModel: GetStationSaleViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;
    listStationUserViewModel: ListStationUserViewModel;
    listPetrolPriceViewModel: ListPetrolPriceViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationSaleGetPageLoad()
    {
        this.getStationSaleViewModel = new GetStationSaleViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.listStationUserViewModel = new ListStationUserViewModel();
        this.listPetrolPriceViewModel = new ListPetrolPriceViewModel();
    }

    onStationSaleGetPageUnload()
    {
        this.getStationSaleViewModel = null;
        this.listPetroStationViewModel = null;
        this.listStationUserViewModel = null;
        this.listPetrolPriceViewModel = null;
    }

}
