import * as React from 'react';
import { Redirect, Route } from 'react-router';
import RouteAuthorizeService from "../../services/RouteAuthorizeService";
import Routes from "../../constants/Routes";
import AuthState from "app/constants/AuthState";
import {useEffect, useState} from "react";
import ErrorPage from "app/components/error-page/ErrorPage";
import UserContext from "identity/contexts/UserContext";

interface ProtectedRouteProps
{
    path: string,
    component?: any,
    allRoles?: boolean,
    roles?: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) =>
{
    const { component: Component } = props;
    const rest = {};
    for (const key of Object.keys(props)) {
        if (key !== "component") {
            rest[key] = props[key];
        }
    }

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

    if(authState == AuthState.loggedIn)
    {
        if(props.allRoles || (UserContext.info && UserContext.info.role))
        {
            return <Route {...rest} render={() => <Component {...props} />} />
        }
        else
        {
            return <Redirect to={Routes.app} />
        }
    }

    if(authState == AuthState.notLoggedIn) return  <Route {...rest} render={() => <Redirect to={Routes.auth} /> } />

    return null;
};

export default ProtectedRoute;
