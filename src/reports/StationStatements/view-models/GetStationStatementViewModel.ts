import StationStatementItem from "../handlers/get/StationStatementItem";
import StationStatementStore from "../stores/StationStatementStore";
import {makeAutoObservable} from "mobx";
import GetStationStatementRequest from "../handlers/get/GetStationStatementRequest";
import GetStationStatementHandler from "../handlers/get/GetStationStatementHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class GetStationStatementViewModel {
    columns: any[];
    stationStatementList: StationStatementItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getStationStatementsRequest: GetStationStatementRequest;

    constructor(public stationStatementStore: StationStatementStore) {
        makeAutoObservable(this);

    }

    public async getAllStationStatement(getStationStatementsRequest: GetStationStatementRequest) {
        try {
            this.isProcessing = true;
            let response = await GetStationStatementHandler.get(getStationStatementsRequest);

            if (response && response.success) {
                debugger;
                let result = response.data;
                let items = result.items;
                this.stationStatementList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('StationStatements.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }

}
