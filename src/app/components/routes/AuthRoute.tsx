import * as React from 'react';
import { Redirect, Route } from 'react-router';
import RouteAuthorizeService from "../../services/RouteAuthorizeService";
import AuthState from "app/constants/AuthState";
import {useEffect, useState} from "react";
import ErrorPage from "app/components/error-page/ErrorPage";

const AuthRoute: React.FC<any> = (props) =>
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

    if(authState == AuthState.loggedIn) return  <Route {...rest} render={() => <Redirect to='/' />} />

    if(authState == AuthState.notLoggedIn) return  <Route {...rest} render={() => <Component {...props} />} />
};

export default AuthRoute;