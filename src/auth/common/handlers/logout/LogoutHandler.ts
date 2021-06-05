import TokenService from "app/services/TokenService";
import LogoutRequest from "auth/common/handlers/logout/LogoutRequest";
import ApiService from "app/services/ApiService";
import NavigationService from "app/services/NavigationService";
import Routes from "app/constants/Routes";
import RoleTypeUtils from "../../../../app/utils/RoleTypeUtils";

export default class LogoutHandler
{
    public static async logout(isAuthorizationError: boolean, reloadApp: boolean = true)
    {
        if(!isAuthorizationError)
        {
            let refreshToken = TokenService.getRefreshToken();

            if(refreshToken)
            {
                let request = new LogoutRequest(refreshToken);
                await ApiService.logout(request);
            }
        }

        TokenService.clearTokens();

        if(reloadApp)
        {
            window.location.reload();
        }
        else
        {
            let roleType: number = +localStorage.getItem("roleType");
            if(roleType) {
                NavigationService.navigate(`/auth/${RoleTypeUtils.getRoleTypeRoute(roleType)}`);
                localStorage.setItem("roleType", "");
            }
            else
                NavigationService.navigate(Routes.auth);
        }
    }
}