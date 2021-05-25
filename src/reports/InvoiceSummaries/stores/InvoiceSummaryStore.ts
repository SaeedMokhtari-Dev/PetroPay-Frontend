import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceSummaryViewModel from "../view-models/GetInvoiceSummaryViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";
import ListCarViewModel from "../../../entities/cars/view-models/ListCarViewModel";
import ListServiceMasterViewModel from "../../../entities/ServiceMasters/view-models/ListServiceMasterViewModel";

export default class InvoiceSummaryStore
{
    getInvoiceSummaryViewModel: GetInvoiceSummaryViewModel;

    listBranchViewModel: ListBranchViewModel;
    listCarViewModel: ListCarViewModel;
    listServiceMasterViewModel: ListServiceMasterViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onInvoiceSummaryGetPageLoad()
    {
        this.getInvoiceSummaryViewModel = new GetInvoiceSummaryViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarViewModel = new ListCarViewModel();
        this.listServiceMasterViewModel = new ListServiceMasterViewModel();
    }

    onInvoiceSummaryGetPageUnload()
    {
        this.getInvoiceSummaryViewModel = null;
        this.listBranchViewModel = null;
        this.listCarViewModel = null;
        this.listServiceMasterViewModel = null;
    }

}
