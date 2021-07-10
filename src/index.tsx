import React from 'react';
import ReactDOM from 'react-dom';
import {AppStore} from "app/stores/AppStore";
import remote from "loglevel-plugin-remote";
import log from "loglevel";
import {endpointUrl} from "app/utils/ApiUtils";
import Endpoints from "app/constants/Endpoints";
import {I18nextProvider} from "react-i18next";
import {Provider} from "mobx-react";
import i18n from "app/utils/i18n";
import App from "app/components/App";
import i18next from "i18next";
import {configure} from "mobx";


const appStore = new AppStore();

const jsonLogger = (log) => ({
    msg: log.message,
    level: log.level.label,
    stacktrace: log.stacktrace,
});

remote.apply(log, {
    format: jsonLogger,
    level: "error",
    url: endpointUrl(Endpoints.apiLog),
});

configure({
    enforceActions: "never",
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false,
    disableErrorBoundaries: false
})
const lang = localStorage.getItem("currentLanguage");
if(lang) {
    i18n.changeLanguage(lang);
}
else
    i18n.changeLanguage(process.env.REACT_APP_DEFAULT_LANGUAGE);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
            <Provider authStore={appStore.auth}
                      pageStore={appStore.page}
                      customerStore={appStore.customer}
                      adminStore={appStore.admin}
                      supplierStore={appStore.supplier}
                      companiesStore={appStore.companies}
                      bundlesStore={appStore.bundles}
                      branchStore={appStore.branch}
                      petroStationStore={appStore.petroStation}
                      stationUserStore={appStore.stationUser}
                      carStore={appStore.car}
                      rechargeBalanceStore={appStore.rechargeBalance}
                      subscriptionStore={appStore.subscription}
                      invoiceSummaryStore={appStore.invoiceSummary}
                      invoiceDetailStore={appStore.invoiceDetail}
                      carBalanceStore={appStore.carBalance}
                      stationReportStore={appStore.stationReport}
                      stationSaleStore={appStore.stationSale}
                      stationStatementStore={appStore.stationStatement}
                      carTransactionStore={appStore.carTransaction}
                      accountBalanceStore={appStore.accountBalance}
                      petrolStationListStore={appStore.petrolStationList}
                      transferBalanceStore={appStore.transferBalance}
                      petropayAccountStore={appStore.petropayAccount}
                      promotionCouponStore={appStore.promotionCoupon}
                      carConsumptionRateStore={appStore.carConsumptionRate}
                      carKmConsumptionStore={appStore.carKmConsumption}
                      carOdometerMaxStore={appStore.carOdometerMax}
                      carOdometerMinStore={appStore.carOdometerMin}
                      odometerBetweenDateStore={appStore.odometerBetweenDate}
                      appSettingStore={appStore.appSetting}
                      odometerRecordStore={appStore.odometerRecord}
                      menuStore={appStore.menu}
            >
                <App />
            </Provider>
    </I18nextProvider>,
    document.getElementById("app")
);
