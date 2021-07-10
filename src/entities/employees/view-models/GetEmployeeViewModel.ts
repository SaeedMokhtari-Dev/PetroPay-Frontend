import EmployeeItem from "../handlers/get/EmployeeItem";

import EmployeeStore from "../stores/EmployeeStore";
import {makeAutoObservable} from "mobx";
import GetEmployeeRequest from "../handlers/get/GetEmployeeRequest";
import GetEmployeeHandler from "../handlers/get/GetEmployeeHandler";
import GetEmployeeResponse from "../handlers/get/GetEmployeeResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteEmployeeHandler from "../handlers/delete/DeleteEmployeeHandler";
import DeleteEmployeeRequest from "../handlers/delete/DeleteEmployeeRequest";
import {message} from "antd";

export default class GetEmployeeViewModel {
    columns: any[];
    employeeList: EmployeeItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    constructor(public employeeStore: EmployeeStore) {
        makeAutoObservable(this);

    }

    public async getAllEmployees(getEmployeesRequest: GetEmployeeRequest) {
        try {
            this.isProcessing = true;
            let response = await GetEmployeeHandler.get(getEmployeesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.employeeList = items;
                this.totalSize = result.totalCount;
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
    public async deleteEmployee(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteEmployeeRequest();
            request.employeesId = key;
            let response = await DeleteEmployeeHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllEmployees(new GetEmployeeRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Employees.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
