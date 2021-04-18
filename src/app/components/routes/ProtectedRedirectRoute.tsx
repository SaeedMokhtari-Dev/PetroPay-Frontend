import * as React from 'react';
import { Redirect, Route } from 'react-router';
import RouteAuthorizeService from "../../services/RouteAuthorizeService";
import Routes from "../../constants/Routes";
import AuthState from "app/constants/AuthState";
import {useEffect, useState} from "react";
import ErrorPage from "app/components/error-page/ErrorPage";

const ProtectedRedirectRoute: React.FC<any> = () =>
{
    const [state, setState] = useState({
        isLoading: true,
        authState: null,
    });

    const { isLoading, authState } = state;

    useEffect(() => { onLoaded() }, []);

    async function onLoaded()
    {
        RouteAuthorizeService.canActivate().then((authState) =>
        {
            setState({
                isLoading: false,
                authState: authState,
            });
        });
    }

    if(isLoading || authState == null) return null;

    if(authState == AuthState.unknown) return <ErrorPage />

    if(authState == AuthState.loggedIn) return  <Route render={() => <Redirect to={Routes.app} />} />

    if(authState == AuthState.notLoggedIn) return  <Route render={() => <Redirect to={Routes.auth} /> } />

    return null;
};

export default ProtectedRedirectRoute;
