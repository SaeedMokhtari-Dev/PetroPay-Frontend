import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import AdminStore from "admin/stores/AdminStore";
import i18next from "i18next";

interface AdminDashboardProps {
    adminStore?: AdminStore
}

const AdminDashboard: React.FC<AdminDashboardProps> = inject(Stores.adminStore)(observer(({adminStore}) =>
{
    return (
        <div>{i18next.t("Dashboard.Admin.Title")}</div>
    )
}));

export default AdminDashboard;
