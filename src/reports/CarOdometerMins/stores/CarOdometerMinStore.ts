import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarOdometerMinViewModel from "../view-models/GetCarOdometerMinViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CarOdometerMinStore
{
    getCarOdometerMinViewModel: GetCarOdometerMinViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarOdometerMinGetPageLoad()
    {
        this.getCarOdometerMinViewModel = new GetCarOdometerMinViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onCarOdometerMinGetPageUnload()
    {
        this.getCarOdometerMinViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
