import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditEmployeeViewModel from "../view-models/EditEmployeeViewModel";
import GetEmployeeViewModel from "../view-models/GetEmployeeViewModel";
import ListMenuViewModel from "../../menus/view-models/ListMenuViewModel";
import TreeMenuViewModel from "../../menus/view-models/TreeMenuViewModel";
import EditEmployeeMenuViewModel from "../view-models/EditEmployeeMenuViewModel";

export default class EmployeeStore
{
    getEmployeeViewModel: GetEmployeeViewModel;
    editEmployeeViewModel: EditEmployeeViewModel;

    treeMenuViewModel: TreeMenuViewModel;
    editEmployeeMenuViewModel: EditEmployeeMenuViewModel;

    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onEmployeeGetPageLoad()
    {
        this.getEmployeeViewModel = new GetEmployeeViewModel(this);
    }

    onEmployeeGetPageUnload()
    {
        this.getEmployeeViewModel = null;
    }
    onEmployeeEditPageLoad()
    {
        this.editEmployeeViewModel = new EditEmployeeViewModel(this);
    }

    onEmployeeEditPageUnload()
    {
        this.editEmployeeViewModel = null;
    }

    onEmployeeMenuEditPageLoad()
    {
        this.editEmployeeMenuViewModel = new EditEmployeeMenuViewModel(this);
        this.treeMenuViewModel = new TreeMenuViewModel();
    }

    onEmployeeMenuEditPageUnLoad()
    {
        this.editEmployeeMenuViewModel = null;
        this.treeMenuViewModel = null;
    }

}
