import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationStatementViewModel from "../view-models/GetStationStatementViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";

export default class StationStatementStore
{
    getStationStatementViewModel: GetStationStatementViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationStatementGetPageLoad()
    {
        this.getStationStatementViewModel = new GetStationStatementViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
    }

    onStationStatementGetPageUnload()
    {
        this.getStationStatementViewModel = null;
        this.listPetroStationViewModel = null;
    }

}
