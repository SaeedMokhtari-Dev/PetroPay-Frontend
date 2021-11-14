import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationReportViewModel from "../view-models/GetStationReportViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";
import ListStationUserViewModel from "../../../entities/station-users/view-models/ListStationUserViewModel";

export default class StationReportStore
{
    getStationReportViewModel: GetStationReportViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;
    listStationUserViewModel: ListStationUserViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationReportGetPageLoad()
    {
        this.getStationReportViewModel = new GetStationReportViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.listStationUserViewModel = new ListStationUserViewModel();
    }

    onStationReportGetPageUnload()
    {
        this.getStationReportViewModel = null;
        this.listPetroStationViewModel = null;
        this.listStationUserViewModel = null;
    }

}
