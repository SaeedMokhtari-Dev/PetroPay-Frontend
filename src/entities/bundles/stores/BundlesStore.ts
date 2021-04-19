import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditBundleViewModel from "../view-models/EditBundleViewModel";
import GetBundleViewModel from "../view-models/GetBundleViewModel";

export default class BundlesStore
{
    getBundleViewModel: GetBundleViewModel;
    editBundleViewModel: EditBundleViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onBundleGetPageLoad()
    {
        this.getBundleViewModel = new GetBundleViewModel(this);
    }

    onBundleGetPageUnload()
    {
        this.getBundleViewModel = null;
    }

    onBundleEditPageLoad()
    {
        this.editBundleViewModel = new EditBundleViewModel(this);
    }

    onBundleEditPageUnload()
    {
        this.editBundleViewModel = null;
    }

}
