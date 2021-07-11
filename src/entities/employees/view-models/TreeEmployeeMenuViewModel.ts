import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import TreeEmployeeMenuResponse from "../handlers/employeeMenuTree/TreeEmployeeMenuResponse";
import TreeEmployeeMenuRequest from "../handlers/employeeMenuTree/TreeEmployeeMenuRequest";
import TreeEmployeeMenuHandler from "../handlers/employeeMenuTree/TreeEmployeeMenuHandler";

export default class TreeEmployeeMenuViewModel {
    isProcessing: boolean;
    errorMessage: string;
    treeEmployeeMenuResponse: TreeEmployeeMenuResponse[] = [];


    constructor() {
        makeAutoObservable(this);
    }

    public async getEmployeeMenuTree(employeeId: number)  {
        try {
            
            this.isProcessing = true;

            let request = new TreeEmployeeMenuRequest(employeeId);
            let response = await TreeEmployeeMenuHandler.get(request);

            if (response && response.success) {
                this.treeEmployeeMenuResponse = [];
                let result = response.data;
                this.treeEmployeeMenuResponse = result;

                return this.treeEmployeeMenuResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('EmployeeMenus.Error.Tree.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
