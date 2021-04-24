import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditStationUserViewModel from "../view-models/EditStationUserViewModel";
import GetStationUserViewModel from "../view-models/GetStationUserViewModel";

export default class StationUserStore
{
    getStationUserViewModel: GetStationUserViewModel;
    editStationUserViewModel: EditStationUserViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationUserGetPageLoad()
    {
        this.getStationUserViewModel = new GetStationUserViewModel(this);
    }

    onStationUserGetPageUnload()
    {
        this.getStationUserViewModel = null;
    }

    onStationUserEditPageLoad()
    {
        this.editStationUserViewModel = new EditStationUserViewModel(this);
    }

    onStationUserEditPageUnload()
    {
        this.editStationUserViewModel = null;
    }

}
