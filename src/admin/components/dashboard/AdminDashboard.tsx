import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import AdminStore from "admin/stores/AdminStore";

interface AdminDashboardProps {
    adminStore?: AdminStore
}

const AdminDashboard: React.FC<AdminDashboardProps> = inject(Stores.adminStore)(observer(({adminStore}) =>
{
    return (
        <div>Admin Dashboard</div>
    )
}));

export default AdminDashboard;