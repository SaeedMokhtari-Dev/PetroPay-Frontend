import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceSummaryViewModel from "../view-models/GetInvoiceSummaryViewModel";

export default class InvoiceSummaryStore
{
    getInvoiceSummaryViewModel: GetInvoiceSummaryViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onInvoiceSummaryGetPageLoad()
    {
        this.getInvoiceSummaryViewModel = new GetInvoiceSummaryViewModel(this);
    }

    onInvoiceSummaryGetPageUnload()
    {
        this.getInvoiceSummaryViewModel = null;
    }

}
