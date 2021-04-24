import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditPetroStationViewModel from "../view-models/EditPetroStationViewModel";
import GetPetroStationViewModel from "../view-models/GetPetroStationViewModel";

export default class PetroStationStore
{
    getPetroStationViewModel: GetPetroStationViewModel;
    editPetroStationViewModel: EditPetroStationViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetroStationGetPageLoad()
    {
        this.getPetroStationViewModel = new GetPetroStationViewModel(this);
    }

    onPetroStationGetPageUnload()
    {
        this.getPetroStationViewModel = null;
    }

    onPetroStationEditPageLoad()
    {
        this.editPetroStationViewModel = new EditPetroStationViewModel(this);
    }

    onPetroStationEditPageUnload()
    {
        this.editPetroStationViewModel = null;
    }

}
