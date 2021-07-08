import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditPromotionCouponRequest from "./EditPromotionCouponRequest";


export default class EditPromotionCouponHandler
{
    public static async edit(request: EditPromotionCouponRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPromotionCouponEdit, request, true);
        return response;
    }
}
