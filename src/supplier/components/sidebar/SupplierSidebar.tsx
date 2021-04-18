import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import SupplierStore from "../../stores/SupplierStore";

interface SupplierSidebarProps {
    supplierStore?: SupplierStore
}

const SupplierSidebar: React.FC<SupplierSidebarProps> = inject(Stores.supplierStore)(observer(({supplierStore}) =>
{
    return (
        <div></div>
    )
}));

export default SupplierSidebar;
