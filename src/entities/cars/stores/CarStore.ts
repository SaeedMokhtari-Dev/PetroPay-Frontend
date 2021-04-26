import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditCarViewModel from "../view-models/EditCarViewModel";
import GetCarViewModel from "../view-models/GetCarViewModel";

export default class CarStore
{
    getCarViewModel: GetCarViewModel;
    editCarViewModel: EditCarViewModel;
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
    }

    onCarEditPageUnload()
    {
        this.editCarViewModel = null;
    }

}
