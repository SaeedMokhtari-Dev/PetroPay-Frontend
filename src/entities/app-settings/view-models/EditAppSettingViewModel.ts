import {makeAutoObservable} from "mobx";
import DetailAppSettingResponse from "../handlers/detail/DetailAppSettingResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailAppSettingHandler from "../handlers/detail/DetailAppSettingHandler";
import DetailAppSettingRequest from "../handlers/detail/DetailAppSettingRequest";
import AddAppSettingRequest from "../handlers/add/AddAppSettingRequest";
import EditAppSettingRequest from "../handlers/edit/EditAppSettingRequest";
import AddAppSettingHandler from "../handlers/add/AddAppSettingHandler";
import {message} from "antd";
import EditAppSettingHandler from "../handlers/edit/EditAppSettingHandler";
import AppSettingStore from "../stores/AppSettingStore";

export default class EditAppSettingViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailAppSettingResponse: DetailAppSettingResponse;
    addAppSettingRequest: AddAppSettingRequest;
    editAppSettingRequest: EditAppSettingRequest;

    constructor(public appSettingsStore: AppSettingStore) {
        makeAutoObservable(this);
    }
    public async getDetailAppSetting()
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailAppSettingRequest();
            let response = await DetailAppSettingHandler.detail(request);

            if(response && response.success)
            {

                this.detailAppSettingResponse = new DetailAppSettingResponse().deserialize(response.data);
                this.editAppSettingRequest = new EditAppSettingRequest();
                for ( let i in this.editAppSettingRequest )
                    if ( this.detailAppSettingResponse.hasOwnProperty( i ) )
                        this.editAppSettingRequest[i] = this.detailAppSettingResponse[i];

                return this.detailAppSettingResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('AppSettings.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addAppSetting(request: AddAppSettingRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddAppSettingHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('AppSettings.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editAppSetting(request: EditAppSettingRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditAppSettingHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('AppSettings.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
