import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCarTransactionViewModel from "../view-models/GetCarTransactionViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CarTransactionStore
{
    getCarTransactionViewModel: GetCarTransactionViewModel;
    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarTransactionGetPageLoad()
    {
        this.getCarTransactionViewModel = new GetCarTransactionViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listCompanyViewModel= new ListCompanyViewModel();
    }

    onCarTransactionGetPageUnload()
    {
        this.getCarTransactionViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listCompanyViewModel = null;
    }

}
