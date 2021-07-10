import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditEmployeeViewModel from "../view-models/EditEmployeeViewModel";
import GetEmployeeViewModel from "../view-models/GetEmployeeViewModel";

export default class EmployeeStore
{
    getEmployeeViewModel: GetEmployeeViewModel;
    editEmployeeViewModel: EditEmployeeViewModel;
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

}
