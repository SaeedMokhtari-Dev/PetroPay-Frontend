import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddPromotionCouponRequest from "./AddPromotionCouponRequest";


export default class AddPromotionCouponHandler
{
    public static async add(request: AddPromotionCouponRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPromotionCouponAdd, request, true);
        return response;
    }
}
