import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarConsumptionRateViewModel from "../view-models/GetCarConsumptionRateViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CarConsumptionRateStore
{
    getCarConsumptionRateViewModel: GetCarConsumptionRateViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarConsumptionRateGetPageLoad()
    {
        this.getCarConsumptionRateViewModel = new GetCarConsumptionRateViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onCarConsumptionRateGetPageUnload()
    {
        this.getCarConsumptionRateViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
