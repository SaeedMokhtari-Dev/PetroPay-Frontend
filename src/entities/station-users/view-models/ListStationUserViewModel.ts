import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListStationUserRequest from "../handlers/list/ListStationUserRequest";
import ListStationUserHandler from "../handlers/list/ListStationUserHandler";
import ListStationUserResponse from "../handlers/list/ListStationUserResponse";

export default class ListStationUserViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listStationUserResponse: ListStationUserResponse = new ListStationUserResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getStationUserList(petrolStationId?: number)  {
        try {
            this.isProcessing = true;

            let request = new ListStationUserRequest(petrolStationId);
            let response = await ListStationUserHandler.get(request);

            if (response && response.success) {
                
                this.listStationUserResponse = new ListStationUserResponse();
                let result = response.data;
                //let items = result.items;
                this.listStationUserResponse.items = result;

                return this.listStationUserResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('StationUsers.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
