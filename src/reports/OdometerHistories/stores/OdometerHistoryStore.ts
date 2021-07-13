import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetOdometerHistoryViewModel from "../view-models/GetOdometerHistoryViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class OdometerHistoryStore
{
    getOdometerHistoryViewModel: GetOdometerHistoryViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onOdometerHistoryGetPageLoad()
    {
        this.getOdometerHistoryViewModel = new GetOdometerHistoryViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onOdometerHistoryGetPageUnload()
    {
        this.getOdometerHistoryViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
