import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetStationStatementViewModel from "../view-models/GetStationStatementViewModel";

export default class StationStatementStore
{
    getStationStatementViewModel: GetStationStatementViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationStatementGetPageLoad()
    {
        this.getStationStatementViewModel = new GetStationStatementViewModel(this);
    }

    onStationStatementGetPageUnload()
    {
        this.getStationStatementViewModel = null;
    }

}
