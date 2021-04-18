import {isNullOrEmpty} from "app/utils/String";
import i18next from "i18next";

export function getLocalizedString(message: string): string
{
    if(!isNullOrEmpty(message) && message.startsWith('Api.'))
    {
        return i18next.t(message);
    }
    else
    {
        return i18next.t("Api.Generic.Error");
    }
}