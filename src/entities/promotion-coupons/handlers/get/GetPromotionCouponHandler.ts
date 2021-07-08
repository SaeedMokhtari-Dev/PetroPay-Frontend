import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetPromotionCouponRequest from "./GetPromotionCouponRequest";

export default class GetPromotionCouponHandler
{
    public static async get(request: GetPromotionCouponRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPromotionCouponGet, request, true);
        return response;
    }
}
