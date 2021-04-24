import {makeAutoObservable} from "mobx";
import DetailPetroStationResponse from "../handlers/detail/DetailPetroStationResponse";
import GetPetroStationHandler from "../handlers/get/GetPetroStationHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailPetroStationHandler from "../handlers/detail/DetailPetroStationHandler";
import DetailPetroStationRequest from "../handlers/detail/DetailPetroStationRequest";
import AddPetroStationRequest from "../handlers/add/AddPetroStationRequest";
import EditPetroStationRequest from "../handlers/edit/EditPetroStationRequest";
import AddPetroStationHandler from "../handlers/add/AddPetroStationHandler";
import {message} from "antd";
import GetPetroStationRequest from "../handlers/get/GetPetroStationRequest";
import EditPetroStationHandler from "../handlers/edit/EditPetroStationHandler";
import UserContext from "../../../identity/contexts/UserContext";
import PetroStationStore from "../stores/PetroStationStore";

export default class EditPetroStationViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailPetroStationResponse: DetailPetroStationResponse;
    addPetroStationRequest: AddPetroStationRequest;
    editPetroStationRequest: EditPetroStationRequest;

    constructor(public petroStationStore: PetroStationStore) {
        makeAutoObservable(this);
    }
    public async getDetailPetroStation(petroStationId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailPetroStationRequest(petroStationId);
            let response = await DetailPetroStationHandler.detail(request);

            if(response && response.success)
            {

                this.detailPetroStationResponse = new DetailPetroStationResponse().deserialize(response.data);
                this.editPetroStationRequest = new EditPetroStationRequest();
                for ( let i in this.editPetroStationRequest )
                    if ( this.detailPetroStationResponse.hasOwnProperty( i ) )
                        this.editPetroStationRequest[i] = this.detailPetroStationResponse[i];


                return this.detailPetroStationResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetroStationes.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addPetroStation(request: AddPetroStationRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddPetroStationHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.petroStationsStore.getPetroStationViewModel.getAllPetroStations(new GetPetroStationsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetroStationes.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editPetroStation(request: EditPetroStationRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditPetroStationHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.petroStationsStore.getPetroStationViewModel.getAllPetroStations(new GetPetroStationsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetroStationes.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
