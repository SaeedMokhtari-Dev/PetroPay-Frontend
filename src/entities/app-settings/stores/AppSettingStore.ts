import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditAppSettingViewModel from "../view-models/EditAppSettingViewModel";

export default class AppSettingStore
{
    editAppSettingViewModel: EditAppSettingViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onAppSettingEditPageLoad()
    {
        this.editAppSettingViewModel = new EditAppSettingViewModel();
    }

    onAppSettingEditPageUnload()
    {
        this.editAppSettingViewModel = null;
    }

}
