import {makeAutoObservable} from "mobx";
import DetailStationUserResponse from "../handlers/detail/DetailStationUserResponse";
import GetStationUserHandler from "../handlers/get/GetStationUserHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailStationUserHandler from "../handlers/detail/DetailStationUserHandler";
import DetailStationUserRequest from "../handlers/detail/DetailStationUserRequest";
import AddStationUserRequest from "../handlers/add/AddStationUserRequest";
import EditStationUserRequest from "../handlers/edit/EditStationUserRequest";
import AddStationUserHandler from "../handlers/add/AddStationUserHandler";
import {message} from "antd";
import GetStationUserRequest from "../handlers/get/GetStationUserRequest";
import EditStationUserHandler from "../handlers/edit/EditStationUserHandler";
import UserContext from "../../../identity/contexts/UserContext";
import StationUserStore from "../stores/StationUserStore";

export default class EditStationUserViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailStationUserResponse: DetailStationUserResponse;
    addStationUserRequest: AddStationUserRequest;
    editStationUserRequest: EditStationUserRequest;

    constructor(public stationUserStore: StationUserStore) {
        makeAutoObservable(this);
    }
    public async getDetailStationUser(stationUserId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailStationUserRequest(stationUserId);
            let response = await DetailStationUserHandler.detail(request);

            if(response && response.success)
            {

                this.detailStationUserResponse = new DetailStationUserResponse().deserialize(response.data);
                this.editStationUserRequest = new EditStationUserRequest();
                for ( let i in this.editStationUserRequest )
                    if ( this.detailStationUserResponse.hasOwnProperty( i ) )
                        this.editStationUserRequest[i] = this.detailStationUserResponse[i];


                return this.detailStationUserResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('StationUseres.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addStationUser(request: AddStationUserRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            request.stationId = UserContext.info.id;
            let response = await AddStationUserHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.stationUsersStore.getStationUserViewModel.getAllStationUsers(new GetStationUsersRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('StationUseres.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editStationUser(request: EditStationUserRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditStationUserHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.stationUsersStore.getStationUserViewModel.getAllStationUsers(new GetStationUsersRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('StationUseres.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
