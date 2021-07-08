import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarKmConsumptionViewModel from "../view-models/GetCarKmConsumptionViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CarKmConsumptionStore
{
    getCarKmConsumptionViewModel: GetCarKmConsumptionViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarKmConsumptionGetPageLoad()
    {
        this.getCarKmConsumptionViewModel = new GetCarKmConsumptionViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onCarKmConsumptionGetPageUnload()
    {
        this.getCarKmConsumptionViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
