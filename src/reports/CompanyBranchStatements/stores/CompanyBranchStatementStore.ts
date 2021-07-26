import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import GetCompanyBranchStatementViewModel from "../view-models/GetCompanyBranchStatementViewModel";
import ListCompanyViewModel from "../../../entities/companies/view-models/ListCompanyViewModel";
import ListBranchViewModel from "../../../entities/branches/view-models/ListBranchViewModel";

export default class CompanyBranchStatementStore
{
    getCompanyBranchStatementViewModel: GetCompanyBranchStatementViewModel;
    listCompanyViewModel: ListCompanyViewModel;
    listBranchViewModel: ListBranchViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCompanyBranchStatementGetPageLoad()
    {
        this.getCompanyBranchStatementViewModel = new GetCompanyBranchStatementViewModel(this);
        this.listCompanyViewModel = new ListCompanyViewModel();
        this.listBranchViewModel = new ListBranchViewModel();
    }

    onCompanyBranchStatementGetPageUnload()
    {
        this.getCompanyBranchStatementViewModel = null;
        this.listCompanyViewModel = null;
        this.listBranchViewModel = null;
    }

}
