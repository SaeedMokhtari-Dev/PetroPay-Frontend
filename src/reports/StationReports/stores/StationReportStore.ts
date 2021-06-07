import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationReportViewModel from "../view-models/GetStationReportViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";

export default class StationReportStore
{
    getStationReportViewModel: GetStationReportViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationReportGetPageLoad()
    {
        this.getStationReportViewModel = new GetStationReportViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
    }

    onStationReportGetPageUnload()
    {
        this.getStationReportViewModel = null;
        this.listPetroStationViewModel = null;
    }

}
