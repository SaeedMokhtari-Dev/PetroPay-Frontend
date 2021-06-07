import StationSaleItem from "../handlers/get/StationSaleItem";
import StationSaleStore from "../stores/StationSaleStore";
import {makeAutoObservable} from "mobx";
import GetStationSaleRequest from "../handlers/get/GetStationSaleRequest";
import GetStationSaleHandler from "../handlers/get/GetStationSaleHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetStationSaleViewModel {
    columns: any[];
    stationSaleList: StationSaleItem[];
    stationSaleExport: StationSaleItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getStationSalesRequest: GetStationSaleRequest;

    constructor(public stationSaleStore: StationSaleStore) {
        makeAutoObservable(this);

    }

    public async getAllStationSale(getStationSalesRequest: GetStationSaleRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getStationSalesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }
            this.isProcessing = true;
            if(exportToFile)
                getStationSalesRequest.exportToFile = exportToFile;
            let response = await GetStationSaleHandler.get(getStationSalesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.stationSaleExport = items;
                else {
                    this.stationSaleList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('StationSales.Error.Get.Message');
            log.error(e);
        } finally {
            getStationSalesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
