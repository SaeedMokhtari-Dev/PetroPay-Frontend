import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetAdminViewModel from "../view-models/GetAdminViewModel";

export default class AdminStore
{
    getAdminViewModel: GetAdminViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onAdminGetPageLoad()
    {
        this.getAdminViewModel = new GetAdminViewModel(this);
    }

    onAdminGetPageUnload()
    {
        this.getAdminViewModel = null;
    }

}
