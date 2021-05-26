import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditTransferBalanceViewModel from "../view-models/EditTransferBalanceViewModel";
import ListCarViewModel from "../../cars/view-models/ListCarViewModel";
import ListBranchViewModel from "../../branches/view-models/ListBranchViewModel";

export default class TransferBalanceStore
{
    editTransferBalanceViewModel: EditTransferBalanceViewModel;
    listCarViewModel: ListCarViewModel;
    listBranchViewModel: ListBranchViewModel;

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

}
