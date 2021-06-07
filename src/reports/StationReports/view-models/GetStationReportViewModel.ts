import StationReportItem from "../handlers/get/StationReportItem";
import StationReportStore from "../stores/StationReportStore";
import {makeAutoObservable} from "mobx";
import GetStationReportRequest from "../handlers/get/GetStationReportRequest";
import GetStationReportHandler from "../handlers/get/GetStationReportHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetStationReportViewModel {
    columns: any[];
    stationReportList: StationReportItem[];
    stationReportExport: StationReportItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getStationReportsRequest: GetStationReportRequest;

    constructor(public stationReportStore: StationReportStore) {
        makeAutoObservable(this);

    }

    public async getAllStationReport(getStationReportsRequest: GetStationReportRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getStationReportsRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            if(exportToFile)
                getStationReportsRequest.exportToFile = exportToFile;
            let response = await GetStationReportHandler.get(getStationReportsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.stationReportExport = items;
                else {
                    this.stationReportList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('StationReports.Error.Get.Message');
            log.error(e);
        } finally {
            getStationReportsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
