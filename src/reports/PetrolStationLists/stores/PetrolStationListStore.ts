import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetPetrolStationListViewModel from "../view-models/GetPetrolStationListViewModel";

export default class PetrolStationListStore
{
    getPetrolStationListViewModel: GetPetrolStationListViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetrolStationListGetPageLoad()
    {
        this.getPetrolStationListViewModel = new GetPetrolStationListViewModel(this);
    }

    onPetrolStationListGetPageUnload()
    {
        this.getPetrolStationListViewModel = null;
    }

}
