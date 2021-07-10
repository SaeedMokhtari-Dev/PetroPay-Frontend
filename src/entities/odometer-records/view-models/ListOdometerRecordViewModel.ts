import OdometerRecordItem from "../handlers/get/OdometerRecordItem";

import OdometerRecordsStore from "../stores/OdometerRecordStore";
import {makeAutoObservable} from "mobx";
import GetOdometerRecordRequest from "../handlers/get/GetOdometerRecordRequest";
import GetOdometerRecordHandler from "../handlers/get/GetOdometerRecordHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class ListOdometerRecordViewModel {
    odometerRecordList: OdometerRecordItem[];
    isProcessing: boolean;
    errorMessage: string;

    constructor() {
        makeAutoObservable(this);
    }

    public async getAllOdometerRecords() {
        try {
            this.isProcessing = true;
            const getOdometerRecordsRequest: GetOdometerRecordRequest = new GetOdometerRecordRequest(10000, 0);

            let response = await GetOdometerRecordHandler.get(getOdometerRecordsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.odometerRecordList = items;
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
}
