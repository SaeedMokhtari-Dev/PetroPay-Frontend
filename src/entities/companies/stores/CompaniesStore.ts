import {AppStore} from "app/stores/AppStore";
import LoginViewModel from "../../../auth/login/view-models/LoginViewModel";
import {makeAutoObservable} from "mobx";
import EditCompanyViewModel from "../view-models/EditCompanyViewModel";
import GetCompanyViewModel from "../view-models/GetCompanyViewModel";

export default class CompaniesStore
{
    getCompanyViewModel: GetCompanyViewModel;
    editCompanyViewModel: EditCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCompanyGetPageLoad()
    {
        this.getCompanyViewModel = new GetCompanyViewModel(this);
    }

    onCompanyGetPageUnload()
    {
        this.getCompanyViewModel = null;
    }

    onCompanyEditPageLoad()
    {
        this.editCompanyViewModel = new EditCompanyViewModel(this);
    }

    onCompanyEditPageUnload()
    {
        this.editCompanyViewModel = null;
    }

}
