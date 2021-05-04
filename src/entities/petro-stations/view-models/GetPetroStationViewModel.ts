import PetroStationItem from "../handlers/get/PetroStationItem";
import AddPetroStationRequest from "../handlers/add/AddPetroStationRequest";
import PetroStationStore from "../stores/PetroStationStore";
import {makeAutoObservable} from "mobx";
import GetPetroStationRequest from "../handlers/get/GetPetroStationRequest";
import GetPetroStationHandler from "../handlers/get/GetPetroStationHandler";
import GetPetroStationResponse from "../handlers/get/GetPetroStationResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeletePetroStationHandler from "../handlers/delete/DeletePetroStationHandler";
import DeletePetroStationRequest from "../handlers/delete/DeletePetroStationRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetPetroStationViewModel {
    columns: any[];
    petroStationList: PetroStationItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addPetroStationRequest: AddPetroStationRequest = new AddPetroStationRequest();
    addedSuccessfully: boolean;

    constructor(public petroStationStore: PetroStationStore) {
        makeAutoObservable(this);

    }

    public async getAllPetroStation(getPetroStationsRequest: GetPetroStationRequest) {
        try {
            this.isProcessing = true;
            let response = await GetPetroStationHandler.get(getPetroStationsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.petroStationList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetroStationes.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deletePetroStation(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeletePetroStationRequest();
            request.stationId = key;
            let response = await DeletePetroStationHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllPetroStation(new GetPetroStationRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetroStationes.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
