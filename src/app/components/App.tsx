import "antd/dist/antd.min.css";
import "app/styles/style.scss";
import React, {Component, Suspense} from "react";
import { ConfigProvider } from 'antd';
import arEG from 'antd/es/locale/ar_EG';
import { Router, Switch, Route, Redirect, useParams } from 'react-router-dom'
import popupContainer from "app/utils/PopupContainer";
import Routes from "app/constants/Routes";
import Login from "auth/login/components/Login";
import history from "app/utils/History";
import NotFoundPage from "app/components/not-found-page/NotFoundPage";
import AuthRoute from "app/components/routes/AuthRoute";
import ProtectedRoute from "app/components/routes/ProtectedRoute";
import ResetPassword from "auth/reset-password/components/ResetPassword";
import ChangePassword from "auth/change-password/components/ChangePassword";
import {getCompanyRoute} from "app/utils/RouteHelper";
import ProtectedRedirectRoute from "app/components/routes/ProtectedRedirectRoute";
import Page from "page/components/Page";
import RoleType from "identity/constants/RoleType";
import Dashboard from "app/components/common/Dashboard";
import EditCompany from "entities/companies/components/company/EditCompany";
import CompaniesList from "../../entities/companies/components/list/CompaniesList";
import en_US from 'antd/lib/locale/en_US';
import ar_EG from 'antd/lib/locale/ar_EG';
import {DirectionType} from "antd/es/config-provider";
import BundlesList from "../../entities/bundles/components/list/BundlesList";
import EditBundle from "../../entities/bundles/components/bundle/EditBundle";
import BranchList from "../../entities/branches/components/list/BranchList";
import EditBranch from "../../entities/branches/components/branch/EditBranch";
import PetroStationList from "../../entities/petro-stations/components/list/PetroStationList";
import EditPetroStation from "../../entities/petro-stations/components/petro-station/EditPetroStation";
import StationUserList from "../../entities/station-users/components/list/StationUserList";
import EditStationUser from "../../entities/station-users/components/station-user/EditStationUser";
import CarList from "../../entities/cars/components/list/CarList";
import EditCar from "../../entities/cars/components/car/EditCar";
import RechargeBalanceList from "../../entities/recharge-balances/components/list/RechargeBalanceList";
import EditRechargeBalance from "../../entities/recharge-balances/components/recharge-balance/EditRechargeBalance";
import SubscriptionList from "../../entities/Subscriptions/components/list/SubscriptionList";
import EditSubscription from "../../entities/Subscriptions/components/subscription/EditSubscription";
import InvoiceSummaryList from "../../reports/InvoiceSummaries/components/list/InvoiceSummaryList";
import InvoiceDetail from "../../reports/InvoiceDetails/components/detail/InvoiceDetail";
import CarBalanceList from "../../reports/CarBalances/components/list/CarBalanceList";
import StationReportList from "../../reports/StationReports/components/list/StationReportList";
import StationSaleList from "../../reports/StationSales/components/list/StationSaleList";
import StationStatementList from "../../reports/StationStatements/components/list/StationStatementList";
import CarTransactionList from "../../reports/CarTransactions/components/list/CarTransactionList";
import AccountBalanceList from "../../reports/AccountBalances/components/list/AccountBalanceList";
import CarAddSubscription from "../../entities/Subscriptions/components/carAdd/CarAddSubscription";
import PetrolStationListList from "../../reports/PetrolStationLists/components/list/PetrolStationListList";
import EditTransferBalance from "../../entities/transfer-balances/components/transfer-balance/EditTransferBalance";
import PaymentPetroStation from "../../entities/petro-stations/components/payment/PaymentPetroStation";
import PaymentPetropayAccount from "../../entities/PetropayAccounts/components/payment/PaymentPetropayAccount";
import PetropayAccountList from "entities/PetropayAccounts/components/list/PetropayAccountList";
import EditPromotionCoupon from "../../entities/promotion-coupons/components/edit/EditPromotionCoupon";
import PromotionCouponsList from "../../entities/promotion-coupons/components/list/PromotionCouponsList";
import CarConsumptionRateList from "../../reports/CarConsumptionRates/components/list/CarConsumptionRateList";
import CarKmConsumptionList from "../../reports/CarKmConsumptions/components/list/CarKmConsumptionList";
import CarOdometerMaxList from "../../reports/CarOdometerMaxes/components/list/CarOdometerMaxList";
import CarOdometerMinList from "../../reports/CarOdometerMins/components/list/CarOdometerMinList";
import OdometerBetweenDateList from "../../reports/OdometerBetweenDates/components/list/OdometerBetweenDateList";
import EditAppSetting from "../../entities/app-settings/components/edit/EditAppSetting";
import OdometerRecordsList from "../../entities/odometer-records/components/list/OdometerRecordsList";
import EditOdometerRecord from "../../entities/odometer-records/components/edit/EditOdometerRecord";
import MenusList from "../../entities/menus/components/list/MenusList";
import EditMenu from "../../entities/menus/components/edit/EditMenu";
import EmployeesList from "../../entities/employees/components/list/EmployeesList";

const App: React.FC = () =>
{
    let antLang = en_US;
    let dir: DirectionType = 'ltr';
    const language = localStorage.getItem("currentLanguage");
    if(language && language != 'en') {
        antLang = ar_EG;
        dir = 'rtl';
    }
    return (
        <ConfigProvider locale={antLang} getPopupContainer={popupContainer} direction={dir}>
            <Suspense fallback="">
                <Router history={history}>
                    <Switch>

                        <ProtectedRedirectRoute exact path="/" />

                        {/* Auth */}
                        <Route path={Routes.auth}>
                            <Switch>
                                <AuthRoute exact path={Routes.auth} component={Login} />
                                <Route exact path={Routes.login} component={Login} />
                                <Route exact path={Routes.resetPassword} component={ResetPassword} />
                                <Route exact path={Routes.changePassword} component={ChangePassword} />

                                <Route component={NotFoundPage} />
                            </Switch>
                        </Route>

                        <ProtectedRoute path={Routes.app} allRoles={true}>
                            <Page>
                                <Switch>
                                    {/* All Roles */}
                                    <Route exact path={Routes.app} component={Dashboard} />

                                    {/* Entities */}
                                    <Route exact roles={[RoleType.admin]} path={Routes.company} component={CompaniesList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editCompany} component={EditCompany} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addCompany} component={EditCompany} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.bundle} component={BundlesList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editBundle} component={EditBundle} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addBundle} component={EditBundle} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.petroStation} component={PetroStationList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addPetroStation} component={EditPetroStation} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editPetroStation} component={EditPetroStation} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.appSetting} component={EditAppSetting} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.branch} component={BranchList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.branchList} component={BranchList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editBranch} component={EditBranch} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addBranch} component={EditBranch} />

                                    <Route exact roles={[RoleType.supplier]} path={Routes.stationUser} component={StationUserList} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.editStationUser} component={EditStationUser} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.addStationUser} component={EditStationUser} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.car} component={CarList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.branchCars} component={CarList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editCar} component={EditCar} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addCar} component={EditCar} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.rechargeBalance} component={RechargeBalanceList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editRechargeBalance} component={EditRechargeBalance} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addRechargeBalance} component={EditRechargeBalance} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.subscription} component={SubscriptionList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editSubscription} component={EditSubscription} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addSubscription} component={EditSubscription} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carAddSubscription} component={CarAddSubscription} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.transferBalance} component={EditTransferBalance} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.promotionCoupon} component={PromotionCouponsList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editPromotionCoupon} component={EditPromotionCoupon} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addPromotionCoupon} component={EditPromotionCoupon} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.paymentPetroStation} component={PaymentPetroStation} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.petropayAccountList} component={PetropayAccountList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.paymentTransferAccount} component={PaymentPetropayAccount} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.odometerRecord} component={OdometerRecordsList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editOdometerRecord} component={EditOdometerRecord} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addOdometerRecord} component={EditOdometerRecord} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.menu} component={MenusList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editMenu} component={EditMenu} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addMenu} component={EditMenu} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.employee} component={EmployeesList} />

                                    {/* Reports */}
                                    <Route exact roles={[RoleType.customer]} path={Routes.invoiceSummary} component={InvoiceSummaryList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.invoiceDetail} component={InvoiceDetail} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carBalance} component={CarBalanceList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carTransaction} component={CarTransactionList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carConsumptionRate} component={CarConsumptionRateList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carKmConsumption} component={CarKmConsumptionList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carOdometerMax} component={CarOdometerMaxList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.carOdometerMin} component={CarOdometerMinList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.odometerBetweenDate} component={OdometerBetweenDateList} />

                                    <Route exact roles={[RoleType.supplier]} path={Routes.stationReport} component={StationReportList} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.stationSale} component={StationSaleList} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.stationStatement} component={StationStatementList} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.accountBalance} component={AccountBalanceList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.petrolStationList} component={PetrolStationListList} />




                                    <Route component={NotFoundPage} />
                                </Switch>
                            </Page>
                        </ProtectedRoute>

                        <Route component={NotFoundPage} />
                    </Switch>
                </Router>
            </Suspense>
        </ConfigProvider>
    );
};

export default App;
