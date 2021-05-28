import React from "react";
import {observer} from "mobx-react";
import UserContext from "identity/contexts/UserContext";
import RoleType from "identity/constants/RoleType";

import CustomerDashboard from "customer/components/dashboard/CustomerDashboard";
import SupplierDashboard from "supplier/components/dashboard/SupplierDashboard";
import AdminDashboard from "../../../admin/components/dashboard/AdminDashboard";

const Dashboard: React.FC = observer(({}) =>
{
    if(!UserContext.info) return null;

    if(UserContext.info.role == RoleType.customer) return <CustomerDashboard />
    if(UserContext.info.role == RoleType.supplier) return <SupplierDashboard />
    if(UserContext.info.role == RoleType.admin) return <AdminDashboard />
});

export default Dashboard;
