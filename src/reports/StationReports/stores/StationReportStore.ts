import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationReportViewModel from "../view-models/GetStationReportViewModel";
import ListPetroStationViewModel from "../../../entities/petro-stations/view-models/ListPetroStationViewModel";
import ListStationUserViewModel from "../../../entities/station-users/view-models/ListStationUserViewModel";
import ListServiceMasterViewModel from "../../../entities/ServiceMasters/view-models/ListServiceMasterViewModel";

export default class StationReportStore
{
    getStationReportViewModel: GetStationReportViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;
    listStationUserViewModel: ListStationUserViewModel;
    listServiceMasterViewModel: ListServiceMasterViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationReportGetPageLoad()
    {
        this.getStationReportViewModel = new GetStationReportViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.listStationUserViewModel = new ListStationUserViewModel();
        this.listServiceMasterViewModel = new ListServiceMasterViewModel();
    }

    onStationReportGetPageUnload()
    {
        this.getStationReportViewModel = null;
        this.listPetroStationViewModel = null;
        this.listStationUserViewModel = null;
        this.listServiceMasterViewModel = null;
    }

}
