import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import ListPetroStationResponse from "../handlers/list/ListPetroStationResponse";
import ListPetroStationRequest from "../handlers/list/ListPetroStationRequest";
import ListPetroStationHandler from "../handlers/list/ListPetroStationHandler";

export default class ListPetroStationViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listPetroStationResponse: ListPetroStationResponse = new ListPetroStationResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getPetroStationList()  {
        try {
            this.isProcessing = true;

            let request = new ListPetroStationRequest();
            let response = await ListPetroStationHandler.get(request);

            if (response && response.success) {
                
                this.listPetroStationResponse = new ListPetroStationResponse();
                let result = response.data;
                //let items = result.items;
                this.listPetroStationResponse.items = result;

                return this.listPetroStationResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetroStations.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
