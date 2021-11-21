import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditCarViewModel from "../view-models/EditCarViewModel";
import GetCarViewModel from "../view-models/GetCarViewModel";
import ListCarTypeMasterViewModel from "../../CarTypeMasters/view-models/ListCarTypeMasterViewModel";
import ListCarBrandMasterRequest from "../../CarBrandMasters/handlers/list/ListCarBrandMasterRequest";
import ListCarModelMasterResponse from "../../CarModelMasters/handlers/list/ListCarModelMasterResponse";
import ListCarBrandMasterViewModel from "../../CarBrandMasters/view-models/ListCarBrandMasterViewModel";
import ListCarModelMasterViewModel from "../../CarModelMasters/view-models/ListCarModelMasterViewModel";
import ListPetrolPriceViewModel from "../../PetrolPrices/view-models/ListPetrolPriceViewModel";
import DetailBranchViewModel from "../../branches/view-models/DetailBranchViewModel";
import ListBranchViewModel from "../../branches/view-models/ListBranchViewModel";

export default class CarStore
{
    getCarViewModel: GetCarViewModel;
    editCarViewModel: EditCarViewModel;

    listBranchViewModel: ListBranchViewModel;
    listCarTypeMasterViewModel: ListCarTypeMasterViewModel;
    listCarBrandMasterViewModel: ListCarBrandMasterViewModel;
    listCarModelMasterViewModel: ListCarModelMasterViewModel;
    listPetrolPriceViewModel: ListPetrolPriceViewModel;
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
        this.listBranchViewModel = new ListBranchViewModel();
        this.listCarTypeMasterViewModel = new ListCarTypeMasterViewModel();
        this.listCarBrandMasterViewModel = new ListCarBrandMasterViewModel();
        this.listCarModelMasterViewModel = new ListCarModelMasterViewModel();
        this.listPetrolPriceViewModel = new ListPetrolPriceViewModel();
        this.editCarViewModel = new EditCarViewModel(this);
    }

    onCarEditPageUnload()
    {
        this.listBranchViewModel = null;
        this.listPetrolPriceViewModel = null;
        this.editCarViewModel = null;
        this.listCarTypeMasterViewModel = null;
        this.listCarBrandMasterViewModel = null;
        this.listCarModelMasterViewModel = null;
    }

}
