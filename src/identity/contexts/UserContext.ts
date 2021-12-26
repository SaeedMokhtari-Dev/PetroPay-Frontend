import UserInfo from "identity/models/UserInfo";
import GetUserInfoHandler from "identity/handlers/user-info/GetUserInfoHandler";
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";
import log from "loglevel";
import AuthState from "app/constants/AuthState";

export default class UserContext
{
    public static info: UserInfo;

    public static async initialize(): Promise<number>
    {
        try
        {
            let response = await GetUserInfoHandler.get();

            if(!response || response.statusCode == -1)
            {
                return AuthState.unknown;
            }

            if(response.success)
            {
                
                this.info = new UserInfo().deserialize(response.data);

                return AuthState.loggedIn;
            }
            else
            {
                await LogoutHandler.logout(true);
            }
        }
        catch (e)
        {
            log.error(e);
        }

        return AuthState.unknown;
    }
}