import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailPromotionCouponRequest from "./DetailPromotionCouponRequest";


export default class DetailPromotionCouponHandler
{
    public static async detail(request: DetailPromotionCouponRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPromotionCouponDetail, request, true);
        return response;
    }
}
