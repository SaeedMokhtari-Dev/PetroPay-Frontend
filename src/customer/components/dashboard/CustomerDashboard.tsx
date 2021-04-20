import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CustomerStore from "../../stores/CustomerStore";
import i18next from "i18next";

interface DashboardProps {
    customerStore?: CustomerStore
}

const CustomerDashboard: React.FC<DashboardProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    return (
        <div>{i18next.t("Dashboard.Customer.Title")}</div>
    )
}));

export default CustomerDashboard;
