import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import AddTransferBonusViewModel from "../view-models/AddTransferBonusViewModel";
import GetTransferBonusViewModel from "../view-models/GetTransferBonusViewModel";
import ListPetroStationViewModel from "../../petro-stations/view-models/ListPetroStationViewModel";
import EditAppSettingViewModel from "../../app-settings/view-models/EditAppSettingViewModel";

export default class TransferBonusStore
{
    addTransferBonusViewModel: AddTransferBonusViewModel;
    getTransferBonusViewModel: GetTransferBonusViewModel;
    listPetroStationViewModel: ListPetroStationViewModel;
    editAppSettingViewModel: EditAppSettingViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onTransferBonusGetPageLoad()
    {
        this.getTransferBonusViewModel = new GetTransferBonusViewModel(this);
    }

    onTransferBonusGetPageUnload()
    {
        this.getTransferBonusViewModel = null;
    }

    onTransferBonusAddPageLoad()
    {
        this.addTransferBonusViewModel = new AddTransferBonusViewModel(this);
        this.listPetroStationViewModel = new ListPetroStationViewModel();
        this.editAppSettingViewModel = new EditAppSettingViewModel();
    }

    onTransferBonusAddPageUnload()
    {
        this.addTransferBonusViewModel = null;
        this.listPetroStationViewModel = null;
        this.editAppSettingViewModel = null;
    }

}
