import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CustomerStore from "../../stores/CustomerStore";

interface CustomerSidebarProps {
    customerStore?: CustomerStore
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    return (
        <div></div>
    )
}));

export default CustomerSidebar;
