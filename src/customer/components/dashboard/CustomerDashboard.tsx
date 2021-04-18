import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CustomerStore from "../../stores/CustomerStore";


interface DashboardProps {
    customerStore?: CustomerStore
}

const CustomerDashboard: React.FC<DashboardProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    return (
        <div>Customer Dashboard</div>
    )
}));

export default CustomerDashboard;
