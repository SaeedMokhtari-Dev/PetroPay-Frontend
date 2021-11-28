import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditStationUserViewModel from "../view-models/EditStationUserViewModel";
import GetStationUserViewModel from "../view-models/GetStationUserViewModel";
import ListPetroStationViewModel from "../../petro-stations/view-models/ListPetroStationViewModel";

export default class StationUserStore
{
    getStationUserViewModel: GetStationUserViewModel;
    editStationUserViewModel: EditStationUserViewModel;

    listPetroStationViewModel: ListPetroStationViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onStationUserGetPageLoad()
    {
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.getStationUserViewModel = new GetStationUserViewModel(this);
    }

    onStationUserGetPageUnload()
    {
        this.listPetroStationViewModel = null;
        this.getStationUserViewModel = null;
    }

    onStationUserEditPageLoad()
    {
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.editStationUserViewModel = new EditStationUserViewModel(this);
    }

    onStationUserEditPageUnload()
    {
        this.editStationUserViewModel = null;
        this.listPetroStationViewModel = null;
    }

}
