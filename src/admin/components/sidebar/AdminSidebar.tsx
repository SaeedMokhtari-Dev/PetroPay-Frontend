import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import AdminStore from "admin/stores/AdminStore";

interface AdminSidebarProps {
    adminStore?: AdminStore
}

const AdminSidebar: React.FC<AdminSidebarProps> = inject(Stores.adminStore)(observer(({adminStore}) =>
{
    return (
        <div>
            Auditors ...
        </div>
    )
}));

export default AdminSidebar;