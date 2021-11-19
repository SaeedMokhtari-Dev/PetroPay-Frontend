
class RoleTypeUtils {

    public static getRoleTypeTitle(roleType: number): string {
        switch (roleType) {
            case 1: case 5:
                return "Customer";
            case 10: case 15:
                return "Supplier";
            case 100:
                return "Admin";
            default:
                return "";
        }
    }
    public static getRoleTypeRoute(roleType: number): string {
        switch (roleType) {
            case 1: case 5:
                return "Customer";
            case 10: case 15:
                return "petrol-station";
            case 100:
                return "Admin";
            default:
                return "";
        }
    }
}

export default RoleTypeUtils;