import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import Sizes from "page/constants/Sizes";
import "./SidebarHeader.scss";
import i18next from "i18next";
import NavigationService from "app/services/NavigationService";
import Routes from "app/constants/Routes";

interface SidebarHeaderProps {
    pageStore?: PageStore
}

const SidebarHeader: React.FC<SidebarHeaderProps> = inject(Stores.pageStore)(observer(({pageStore}) =>
{
    function navigateHome()
    {
        NavigationService.navigate(Routes.app);
    }

    return (
        <div className='sidebar-header' style={{height: Sizes.headerHeight}}>
            <img onClick={navigateHome} title={i18next.t('App.Title')} alt={i18next.t('App.Title')} className='logo noselect' src="/images/wp-soft-logo-sidebar.png" />
        </div>
    )
}));

export default SidebarHeader;