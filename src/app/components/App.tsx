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

const App: React.FC = () =>
{
    let antLang = en_US;
    let dir: DirectionType = 'ltr';
    const language = localStorage.getItem("currentLanguage");
    if(language != 'en') {
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
                                <AuthRoute exact path={Routes.resetPassword} component={ResetPassword} />
                                <Route exact path={Routes.changePassword} component={ChangePassword} />

                                <Route component={NotFoundPage} />
                            </Switch>
                        </Route>

                        <ProtectedRoute path={Routes.app} allRoles={true}>
                            <Page>
                                <Switch>
                                    {/* All Roles */}
                                    <Route exact path={Routes.app} component={Dashboard} />

                                    {/* Superadmin */}
                                    <Route exact roles={[RoleType.admin]} path={Routes.company} component={CompaniesList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editCompany} component={EditCompany} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addCompany} component={EditCompany} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.bundle} component={BundlesList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editBundle} component={EditBundle} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addBundle} component={EditBundle} />

                                    <Route exact roles={[RoleType.admin]} path={Routes.petroStation} component={PetroStationList} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.addPetroStation} component={EditPetroStation} />
                                    <Route exact roles={[RoleType.admin]} path={Routes.editPetroStation} component={EditPetroStation} />

                                    <Route exact roles={[RoleType.customer]} path={Routes.branch} component={BranchList} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.editBranch} component={EditBranch} />
                                    <Route exact roles={[RoleType.customer]} path={Routes.addBranch} component={EditBranch} />

                                    <Route exact roles={[RoleType.supplier]} path={Routes.stationUser} component={StationUserList} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.editStationUser} component={EditStationUser} />
                                    <Route exact roles={[RoleType.supplier]} path={Routes.addStationUser} component={EditStationUser} />

                                    {/* Admin */}

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
