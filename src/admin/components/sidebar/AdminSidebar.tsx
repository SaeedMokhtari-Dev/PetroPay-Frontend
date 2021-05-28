import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import AdminStore from "../../stores/AdminStore";

interface AdminSidebarProps {
    customerStore?: AdminStore
}

const AdminSidebar: React.FC<AdminSidebarProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    return (
        <div></div>
    )
}));

export default AdminSidebar;
