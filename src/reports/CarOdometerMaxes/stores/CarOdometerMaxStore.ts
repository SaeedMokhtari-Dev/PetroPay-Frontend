import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarOdometerMaxViewModel from "../view-models/GetCarOdometerMaxViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CarOdometerMaxStore
{
    getCarOdometerMaxViewModel: GetCarOdometerMaxViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarOdometerMaxGetPageLoad()
    {
        this.getCarOdometerMaxViewModel = new GetCarOdometerMaxViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onCarOdometerMaxGetPageUnload()
    {
        this.getCarOdometerMaxViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
