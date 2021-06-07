import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceSummaryViewModel from "../view-models/GetInvoiceSummaryViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListServiceMasterViewModel from "../../../entities/ServiceMasters/view-models/ListServiceMasterViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class InvoiceSummaryStore
{
    getInvoiceSummaryViewModel: GetInvoiceSummaryViewModel;

    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listServiceMasterViewModel: ListServiceMasterViewModel;
    listCompanyViewModel: ListCompanyViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onInvoiceSummaryGetPageLoad()
    {
        this.getInvoiceSummaryViewModel = new GetInvoiceSummaryViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listServiceMasterViewModel = new ListServiceMasterViewModel();
        this.listCompanyViewModel = new ListCompanyViewModel();
    }

    onInvoiceSummaryGetPageUnload()
    {
        this.getInvoiceSummaryViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listServiceMasterViewModel = null;
        this.listCompanyViewModel = null;
    }

}
