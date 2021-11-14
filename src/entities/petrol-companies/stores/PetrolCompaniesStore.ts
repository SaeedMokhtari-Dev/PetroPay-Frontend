import {AppStore} from "app/stores/AppStore";
import LoginViewModel from "../../../auth/login/view-models/LoginViewModel";
import {makeAutoObservable} from "mobx";
import EditPetrolCompanyViewModel from "../view-models/EditPetrolCompanyViewModel";
import GetPetrolCompanyViewModel from "../view-models/GetPetrolCompanyViewModel";

export default class PetrolCompaniesStore
{
    getPetrolCompanyViewModel: GetPetrolCompanyViewModel;
    editPetrolCompanyViewModel: EditPetrolCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onPetrolCompanyGetPageLoad()
    {
        this.getPetrolCompanyViewModel = new GetPetrolCompanyViewModel(this);
    }

    onPetrolCompanyGetPageUnload()
    {
        this.getPetrolCompanyViewModel = null;
    }

    onPetrolCompanyEditPageLoad()
    {
        this.editPetrolCompanyViewModel = new EditPetrolCompanyViewModel(this);
    }

    onPetrolCompanyEditPageUnload()
    {
        this.editPetrolCompanyViewModel = null;
    }

}
