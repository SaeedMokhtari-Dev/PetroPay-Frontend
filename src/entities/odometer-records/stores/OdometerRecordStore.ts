import {AppStore} from "app/stores/AppStore";
import {makeAutoObservable} from "mobx";
import EditOdometerRecordViewModel from "../view-models/EditOdometerRecordViewModel";
import GetOdometerRecordViewModel from "../view-models/GetOdometerRecordViewModel";
import ListCarViewModel from "../../cars/view-models/ListCarViewModel";

export default class OdometerRecordStore
{
    getOdometerRecordViewModel: GetOdometerRecordViewModel;
    editOdometerRecordViewModel: EditOdometerRecordViewModel;

    listCarViewModel: ListCarViewModel;
    constructor(public appStore: AppStore) {
        makeAutoObservable(this);
    }

    onOdometerRecordGetPageLoad()
    {
        this.getOdometerRecordViewModel = new GetOdometerRecordViewModel(this);
    }

    onOdometerRecordGetPageUnload()
    {
        this.getOdometerRecordViewModel = null;
    }

    onOdometerRecordEditPageLoad()
    {
        this.editOdometerRecordViewModel = new EditOdometerRecordViewModel(this);
        this.listCarViewModel = new ListCarViewModel();
    }

    onOdometerRecordEditPageUnload()
    {
        this.editOdometerRecordViewModel = null;
        this.listCarViewModel = null;
    }

}
