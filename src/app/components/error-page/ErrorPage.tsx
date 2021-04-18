import {Button, Result} from "antd";
import React from "react";
import i18next from "i18next";
import "./ErrorPage.scss";
import {withTranslation} from "react-i18next";

interface ErrorPageProps {
    title?: string,
    message?: string
}

const ErrorPage = ({title, message}: ErrorPageProps) =>
{
    let errorTitle = title ? title : i18next.t('General.Error.Title');
    let errorMessage = message ? message : i18next.t('General.Error.Message');

    function reloadApp() {
        window.location.reload();
    }

    return(
        <div className="error-page">
            <Result
                status="500"
                title={errorTitle}
                subTitle={errorMessage}
                extra={<Button onClick={reloadApp} className="btn-reload-app" type="primary">{i18next.t('General.Reload.Application')}</Button>}
            />
        </div>
    )
};

export default withTranslation()(ErrorPage);