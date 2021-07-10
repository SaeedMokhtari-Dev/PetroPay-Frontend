
import {makeAutoObservable} from "mobx";
import DetailOdometerRecordResponse from "../handlers/detail/DetailOdometerRecordResponse";
import GetOdometerRecordHandler from "../handlers/get/GetOdometerRecordHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailOdometerRecordHandler from "../handlers/detail/DetailOdometerRecordHandler";
import DetailOdometerRecordRequest from "../handlers/detail/DetailOdometerRecordRequest";
import AddOdometerRecordRequest from "../handlers/add/AddOdometerRecordRequest";
import EditOdometerRecordRequest from "../handlers/edit/EditOdometerRecordRequest";
import AddOdometerRecordHandler from "../handlers/add/AddOdometerRecordHandler";
import {message} from "antd";
import GetOdometerRecordRequest from "../handlers/get/GetOdometerRecordRequest";
import EditOdometerRecordHandler from "../handlers/edit/EditOdometerRecordHandler";
import OdometerRecordStore from "../stores/OdometerRecordStore";

export default class EditOdometerRecordViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailOdometerRecordResponse: DetailOdometerRecordResponse;
    addOdometerRecordRequest: AddOdometerRecordRequest;
    editOdometerRecordRequest: EditOdometerRecordRequest;

    constructor(public odometerRecordsStore: OdometerRecordStore) {
        makeAutoObservable(this);
    }
    public async getDetailOdometerRecord(odometerRecordId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailOdometerRecordRequest(odometerRecordId);
            let response = await DetailOdometerRecordHandler.detail(request);

            if(response && response.success)
            {

                this.detailOdometerRecordResponse = new DetailOdometerRecordResponse().deserialize(response.data);
                this.editOdometerRecordRequest = new EditOdometerRecordRequest();
                for ( let i in this.editOdometerRecordRequest )
                    if ( this.detailOdometerRecordResponse.hasOwnProperty( i ) )
                        this.editOdometerRecordRequest[i] = this.detailOdometerRecordResponse[i];


                return this.detailOdometerRecordResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('OdometerRecords.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addOdometerRecord(request: AddOdometerRecordRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddOdometerRecordHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.odometerRecordsStore.getOdometerRecordViewModel.getAllOdometerRecords(new GetOdometerRecordsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('OdometerRecords.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editOdometerRecord(request: EditOdometerRecordRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditOdometerRecordHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.odometerRecordsStore.getOdometerRecordViewModel.getAllOdometerRecords(new GetOdometerRecordsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('OdometerRecords.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
