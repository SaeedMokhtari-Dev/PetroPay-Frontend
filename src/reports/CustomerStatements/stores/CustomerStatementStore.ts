import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCustomerStatementViewModel from "../view-models/GetCustomerStatementViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";

export default class CustomerStatementStore
{
    getCustomerStatementViewModel: GetCustomerStatementViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCustomerStatementGetPageLoad()
    {
        this.getCustomerStatementViewModel = new GetCustomerStatementViewModel(this);
        this.listCompanyViewModel = new ListCompanyViewModel();
    }

    onCustomerStatementGetPageUnload()
    {
        this.getCustomerStatementViewModel = null;
        this.listCompanyViewModel = null;
    }

}
