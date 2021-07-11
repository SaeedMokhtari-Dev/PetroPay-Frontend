import {makeAutoObservable} from "mobx";
import Sizes from "page/constants/Sizes";
import {AppStore} from "app/stores/AppStore";
import ChangeUserPasswordRequest from "../../auth/common/handlers/change-user-password/ChangeUserPasswordRequest";
import TreeEmployeeMenuViewModel from "../../entities/employees/view-models/TreeEmployeeMenuViewModel";
import GetEmployeeViewModel from "../../entities/employees/view-models/GetEmployeeViewModel";

export default class PageStore
{
    isSidebarCollapsed: boolean;

    currentLanguage: string;

    changeUserPasswordRequest: ChangeUserPasswordRequest;

    treeEmployeeMenuViewModel: TreeEmployeeMenuViewModel;

    constructor(public appStore: AppStore)
    {
        makeAutoObservable(this);
    }

    onSidebarPageLoad()
    {
        
        this.treeEmployeeMenuViewModel = new TreeEmployeeMenuViewModel();
    }

    onSidebarPageUnLoad()
    {
        this.treeEmployeeMenuViewModel = null;
    }
}
