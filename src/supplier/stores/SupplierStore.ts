import {AppStore} from "app/stores/AppStore";
import GetSupplierViewModel from "../view-models/GetSupplierViewModel";

export default class SupplierStore
{
    getSupplierViewModel: GetSupplierViewModel;
    constructor(public appStore: AppStore) {
    }
    onSupplierGetPageLoad()
    {
        this.getSupplierViewModel = new GetSupplierViewModel(this);
    }

    onSupplierGetPageUnload()
    {
        this.getSupplierViewModel = null;
    }
}
