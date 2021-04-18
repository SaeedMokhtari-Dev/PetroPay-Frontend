import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import SupplierStore from "../../stores/SupplierStore";


interface DashboardProps {
    supplierStore?: SupplierStore
}

const SupplierDashboard: React.FC<DashboardProps> = inject(Stores.supplierStore)(observer(({supplierStore}) =>
{
    return (
        <div>Supplier Dashboard</div>
    )
}));

export default SupplierDashboard;
