import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditTransferBalanceViewModel from "../view-models/EditTransferBalanceViewModel";
import ListCarViewModel from "../../cars/view-models/ListCarViewModel";
import ListBranchViewModel from "../../branches/view-models/ListBranchViewModel";
import CarBatchTransferBalanceViewModel from "../view-models/CarBatchTransferBalanceViewModel";
import DetailBranchViewModel from "../../branches/view-models/DetailBranchViewModel";

export default class TransferBalanceStore
{
    editTransferBalanceViewModel: EditTransferBalanceViewModel;
    listCarViewModel: ListCarViewModel;
    listBranchViewModel: ListBranchViewModel;

    carBatchTransferBalanceViewModel: CarBatchTransferBalanceViewModel;
    detailBranchViewModel: DetailBranchViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onTransferBalanceEditPageLoad()
    {
        this.editTransferBalanceViewModel = new EditTransferBalanceViewModel(this);
        this.listCarViewModel = new ListCarViewModel();
        this.listBranchViewModel = new ListBranchViewModel();
    }

    onTransferBalanceEditPageUnload()
    {
        this.editTransferBalanceViewModel = null;
        this.listCarViewModel = null;
        this.listBranchViewModel = null;
    }

    onCarBatchTransferBalancePageLoad()
    {
        this.listCarViewModel = new ListCarViewModel();
        this.detailBranchViewModel = new DetailBranchViewModel();
        this.carBatchTransferBalanceViewModel = new CarBatchTransferBalanceViewModel(this);
        this.listBranchViewModel = new ListBranchViewModel();
    }

    onCarBatchTransferBalancePageUnload()
    {
        this.carBatchTransferBalanceViewModel = null;
        this.listCarViewModel = null;
        this.detailBranchViewModel = null;
        this.listBranchViewModel = null;
    }

}
