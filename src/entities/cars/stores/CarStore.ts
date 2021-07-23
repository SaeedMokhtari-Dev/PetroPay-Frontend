import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditCarViewModel from "../view-models/EditCarViewModel";
import GetCarViewModel from "../view-models/GetCarViewModel";
import ListCarTypeMasterViewModel from "../../CarTypeMasters/view-models/ListCarTypeMasterViewModel";

export default class CarStore
{
    getCarViewModel: GetCarViewModel;
    editCarViewModel: EditCarViewModel;

    listCarTypeMasterViewModel: ListCarTypeMasterViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onCarGetPageLoad()
    {
        this.getCarViewModel = new GetCarViewModel(this);
    }

    onCarGetPageUnload()
    {
        this.getCarViewModel = null;
    }

    onCarEditPageLoad()
    {
        this.editCarViewModel = new EditCarViewModel(this);
        this.listCarTypeMasterViewModel = new ListCarTypeMasterViewModel();
    }

    onCarEditPageUnload()
    {
        this.editCarViewModel = null;
        this.listCarTypeMasterViewModel = null;
    }

}
