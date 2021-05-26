import PetrolStationListItem from "../handlers/get/PetrolStationListItem";
import PetrolStationListStore from "../stores/PetrolStationListStore";
import {makeAutoObservable} from "mobx";
import GetPetrolStationListRequest from "../handlers/get/GetPetrolStationListRequest";
import GetPetrolStationListHandler from "../handlers/get/GetPetrolStationListHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class GetPetrolStationListViewModel {
    columns: any[];
    petrolStationListList: PetrolStationListItem[];
    petrolStationListExport: PetrolStationListItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getPetrolStationListsRequest: GetPetrolStationListRequest;

    constructor(public petrolStationListStore: PetrolStationListStore) {
        makeAutoObservable(this);

    }

    public async getAllPetrolStationList(getPetrolStationListsRequest: GetPetrolStationListRequest, exportToFile: boolean = false) {
        try {
            this.isProcessing = true;
            if(exportToFile)
                getPetrolStationListsRequest.exportToFile = exportToFile;
            let response = await GetPetrolStationListHandler.get(getPetrolStationListsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.petrolStationListExport = items;
                else {
                    this.petrolStationListList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetrolStationLists.Error.Get.Message');
            log.error(e);
        } finally {
            getPetrolStationListsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
