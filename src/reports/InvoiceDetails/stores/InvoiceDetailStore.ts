import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceDetailViewModel from "../view-models/GetInvoiceDetailViewModel";

export default class InvoiceDetailStore
{
    getInvoiceDetailViewModel: GetInvoiceDetailViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onInvoiceDetailGetPageLoad()
    {
        this.getInvoiceDetailViewModel = new GetInvoiceDetailViewModel(this);
    }

    onInvoiceDetailGetPageUnload()
    {
        this.getInvoiceDetailViewModel = null;
    }

}
