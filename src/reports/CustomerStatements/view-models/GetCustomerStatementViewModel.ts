import CustomerStatementItem from "../handlers/get/CustomerStatementItem";
import CustomerStatementStore from "../stores/CustomerStatementStore";
import {makeAutoObservable} from "mobx";
import GetCustomerStatementRequest from "../handlers/get/GetCustomerStatementRequest";
import GetCustomerStatementHandler from "../handlers/get/GetCustomerStatementHandler";
import GetCustomerStatementResponse from "../handlers/get/GetCustomerStatementResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetCustomerStatementViewModel {
    columns: any[];
    customerStatementList: CustomerStatementItem[];
    customerStatementExport: CustomerStatementItem[];
    sumCustomerStatement: number;
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCustomerStatementsRequest: GetCustomerStatementRequest;

    constructor(public customerStatementStore: CustomerStatementStore) {
        makeAutoObservable(this);

    }

    public async getAllCustomerStatement(getCustomerStatementsRequest: GetCustomerStatementRequest, exportToFile: boolean = false) {
        try {
            this.isProcessing = true;
            getCustomerStatementsRequest.exportToFile = exportToFile;
            let response = await GetCustomerStatementHandler.get(getCustomerStatementsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.customerStatementExport = items;
                else {
                    this.customerStatementList = items;
                    this.totalSize = result.totalCount;
                    this.sumCustomerStatement = result.sumCustomerStatement;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CustomerStatements.Error.Get.Message');
            log.error(e);
        } finally {
            getCustomerStatementsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
