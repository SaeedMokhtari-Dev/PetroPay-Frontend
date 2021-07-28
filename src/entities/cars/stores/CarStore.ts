import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditCarViewModel from "../view-models/EditCarViewModel";
import GetCarViewModel from "../view-models/GetCarViewModel";
import ListCarTypeMasterViewModel from "../../CarTypeMasters/view-models/ListCarTypeMasterViewModel";
import ListCarBrandMasterRequest from "../../CarBrandMasters/handlers/list/ListCarBrandMasterRequest";
import ListCarModelMasterResponse from "../../CarModelMasters/handlers/list/ListCarModelMasterResponse";
import ListCarBrandMasterViewModel from "../../CarBrandMasters/view-models/ListCarBrandMasterViewModel";
import ListCarModelMasterViewModel from "../../CarModelMasters/view-models/ListCarModelMasterViewModel";

export default class CarStore
{
    getCarViewModel: GetCarViewModel;
    editCarViewModel: EditCarViewModel;

    listCarTypeMasterViewModel: ListCarTypeMasterViewModel;
    listCarBrandMasterViewModel: ListCarBrandMasterViewModel;
    listCarModelMasterViewModel: ListCarModelMasterViewModel;
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
        this.listCarBrandMasterViewModel = new ListCarBrandMasterViewModel();
        this.listCarModelMasterViewModel = new ListCarModelMasterViewModel();
    }

    onCarEditPageUnload()
    {
        this.editCarViewModel = null;
        this.listCarTypeMasterViewModel = null;
        this.listCarBrandMasterViewModel = null;
        this.listCarModelMasterViewModel = null;
    }

}
