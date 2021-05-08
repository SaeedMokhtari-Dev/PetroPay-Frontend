import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationReportViewModel from "../view-models/GetStationReportViewModel";

export default class StationReportStore
{
    getStationReportViewModel: GetStationReportViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationReportGetPageLoad()
    {
        this.getStationReportViewModel = new GetStationReportViewModel(this);
    }

    onStationReportGetPageUnload()
    {
        this.getStationReportViewModel = null;
    }

}
