import history from "../utils/History";

export default class NavigationService
{
    public static navigate(route: string)
    {
        history.push(route);
    }

    public static goBack()
    {
        history.goBack();
    }
}