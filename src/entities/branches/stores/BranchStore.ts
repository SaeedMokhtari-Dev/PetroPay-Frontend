import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditBranchViewModel from "../view-models/EditBranchViewModel";
import GetBranchViewModel from "../view-models/GetBranchViewModel";

export default class BranchStore
{
    getBranchViewModel: GetBranchViewModel;
    editBranchViewModel: EditBranchViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onBranchGetPageLoad()
    {
        this.getBranchViewModel = new GetBranchViewModel(this);
    }

    onBranchGetPageUnload()
    {
        this.getBranchViewModel = null;
    }

    onBranchEditPageLoad()
    {
        this.editBranchViewModel = new EditBranchViewModel(this);
    }

    onBranchEditPageUnload()
    {
        this.editBranchViewModel = null;
    }

}
