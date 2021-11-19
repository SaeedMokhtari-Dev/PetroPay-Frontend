import OdometerRecordItem from "../handlers/get/OdometerRecordItem";

import OdometerRecordStore from "../stores/OdometerRecordStore";
import {makeAutoObservable} from "mobx";
import GetOdometerRecordRequest from "../handlers/get/GetOdometerRecordRequest";
import GetOdometerRecordHandler from "../handlers/get/GetOdometerRecordHandler";
import GetOdometerRecordResponse from "../handlers/get/GetOdometerRecordResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteOdometerRecordHandler from "../handlers/delete/DeleteOdometerRecordHandler";
import DeleteOdometerRecordRequest from "../handlers/delete/DeleteOdometerRecordRequest";
import {message} from "antd";

export default class GetOdometerRecordViewModel {
    columns: any[];
    odometerRecordList: OdometerRecordItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;
    companyId: number;
    branchId: number;

    constructor(public odometerRecordsStore: OdometerRecordStore) {
        makeAutoObservable(this);

    }

    public async getAllOdometerRecords(getOdometerRecordsRequest: GetOdometerRecordRequest) {
        try {
            this.isProcessing = true;
            let response = await GetOdometerRecordHandler.get(getOdometerRecordsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.odometerRecordList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('OdometerRecords.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteOdometerRecord(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteOdometerRecordRequest();
            request.odometerRecordId = key;
            let response = await DeleteOdometerRecordHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllOdometerRecords(new GetOdometerRecordRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('OdometerRecords.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
