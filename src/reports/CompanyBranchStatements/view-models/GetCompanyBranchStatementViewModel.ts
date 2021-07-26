import CompanyBranchStatementItem from "../handlers/get/CompanyBranchStatementItem";
import CompanyBranchStatementStore from "../stores/CompanyBranchStatementStore";
import {makeAutoObservable} from "mobx";
import GetCompanyBranchStatementRequest from "../handlers/get/GetCompanyBranchStatementRequest";
import GetCompanyBranchStatementHandler from "../handlers/get/GetCompanyBranchStatementHandler";
import GetCompanyBranchStatementResponse from "../handlers/get/GetCompanyBranchStatementResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetCompanyBranchStatementViewModel {
    columns: any[];
    companyBranchStatementList: CompanyBranchStatementItem[];
    companyBranchStatementExport: CompanyBranchStatementItem[];
    sumCompanyBranchStatement: number;
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCompanyBranchStatementsRequest: GetCompanyBranchStatementRequest;

    constructor(public companyBranchStatementStore: CompanyBranchStatementStore) {
        makeAutoObservable(this);

    }

    public async getAllCompanyBranchStatement(getCompanyBranchStatementsRequest: GetCompanyBranchStatementRequest, exportToFile: boolean = false) {
        try {
            this.isProcessing = true;
            getCompanyBranchStatementsRequest.exportToFile = exportToFile;
            let response = await GetCompanyBranchStatementHandler.get(getCompanyBranchStatementsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.companyBranchStatementExport = items;
                else {
                    this.companyBranchStatementList = items;
                    this.totalSize = result.totalCount;
                    this.sumCompanyBranchStatement = result.sumCompanyBranchStatement;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CompanyBranchStatements.Error.Get.Message');
            log.error(e);
        } finally {
            getCompanyBranchStatementsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
