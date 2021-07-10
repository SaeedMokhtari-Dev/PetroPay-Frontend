import EmployeeItem from "../handlers/get/EmployeeItem";

import EmployeesStore from "../stores/EmployeeStore";
import {makeAutoObservable} from "mobx";
import GetEmployeeRequest from "../handlers/get/GetEmployeeRequest";
import GetEmployeeHandler from "../handlers/get/GetEmployeeHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class ListEmployeeViewModel {
    employeeList: EmployeeItem[];
    isProcessing: boolean;
    errorMessage: string;

    constructor() {
        makeAutoObservable(this);
    }

    public async getAllEmployees() {
        try {
            this.isProcessing = true;
            const getEmployeesRequest: GetEmployeeRequest = new GetEmployeeRequest(10000, 0);

            let response = await GetEmployeeHandler.get(getEmployeesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.employeeList = items;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Employees.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
