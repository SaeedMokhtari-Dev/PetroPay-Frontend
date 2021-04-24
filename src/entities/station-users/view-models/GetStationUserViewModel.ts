import StationUserItem from "../handlers/get/StationUserItem";
import AddStationUserRequest from "../handlers/add/AddStationUserRequest";
import StationUserStore from "../stores/StationUserStore";
import {makeAutoObservable} from "mobx";
import GetStationUserRequest from "../handlers/get/GetStationUserRequest";
import GetStationUserHandler from "../handlers/get/GetStationUserHandler";
import GetStationUserResponse from "../handlers/get/GetStationUserResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteStationUserHandler from "../handlers/delete/DeleteStationUserHandler";
import DeleteStationUserRequest from "../handlers/delete/DeleteStationUserRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetStationUserViewModel {
    searchText: string;
    showArchived: boolean;
    columns: any[];
    stationUserList: StationUserItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addStationUserRequest: AddStationUserRequest = new AddStationUserRequest();
    addedSuccessfully: boolean;

    constructor(public stationUserStore: StationUserStore) {
        makeAutoObservable(this);

    }

    public async getAllStationUser(getStationUsersRequest: GetStationUserRequest) {
        try {
            this.isProcessing = true;
            let response = await GetStationUserHandler.get(getStationUsersRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.stationUserList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('StationUsers.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteStationUser(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteStationUserRequest();
            request.stationWorkerId = key;
            let response = await DeleteStationUserHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllStationUser(new GetStationUserRequest(UserContext.info.id, this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('StationUsers.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

    /*public search(searchText: string){
         this.stationUserList = this.completeStationUserList.filter(w => w.name.toUpperCase().includes(searchText.toUpperCase()));
    }*/

    /*public async addStationUser(request: AddStationUserRequest)
    {
        try
        {
            this.isProcessing = true;
            this.errorMessage = "";
            let response = await AddStationUserHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                this.addStationUserRequest = new AddStationUserRequest();
                await this.getAllAuditingStationUsers(this.showArchived);
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('StationUsers.Error.Add.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }*/

}
