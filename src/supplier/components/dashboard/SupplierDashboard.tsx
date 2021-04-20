import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import SupplierStore from "../../stores/SupplierStore";
import i18next from "i18next";

interface DashboardProps {
    supplierStore?: SupplierStore
}

const SupplierDashboard: React.FC<DashboardProps> = inject(Stores.supplierStore)(observer(({supplierStore}) =>
{
    return (
        <div>{i18next.t("Dashboard.Supplier.Title")}</div>
    )
}));

export default SupplierDashboard;
