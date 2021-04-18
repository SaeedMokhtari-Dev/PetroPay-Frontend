import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import Icon from "@iconify/react";
import bxMenu from "@iconify-icons/bx/bx-menu";
import "./HamburgerButton.scss";
import Sizes from "page/constants/Sizes";

interface HamburgerButtonProps {
    pageStore?: PageStore
}

const HamburgerButton: React.FC<HamburgerButtonProps> = inject(Stores.pageStore)(observer(({pageStore}) =>
{
    function toggleSidebarVisibility()
    {
        pageStore.isSidebarCollapsed = !pageStore.isSidebarCollapsed;
    }

    return (
        <div className='hamburger-btn-ct' style={{width: Sizes.headerHeight, height: Sizes.headerHeight}}>
            <button onClick={toggleSidebarVisibility} className='btn-simple btn-page-hamburger'>
                <Icon height={30} icon={bxMenu}/>
            </button>
        </div>
    )
}));

export default HamburgerButton;