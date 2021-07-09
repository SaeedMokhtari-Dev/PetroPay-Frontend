import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetOdometerBetweenDateViewModel from "../view-models/GetOdometerBetweenDateViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class OdometerBetweenDateStore
{
    getOdometerBetweenDateViewModel: GetOdometerBetweenDateViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onOdometerBetweenDateGetPageLoad()
    {
        this.getOdometerBetweenDateViewModel = new GetOdometerBetweenDateViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onOdometerBetweenDateGetPageUnload()
    {
        this.getOdometerBetweenDateViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
