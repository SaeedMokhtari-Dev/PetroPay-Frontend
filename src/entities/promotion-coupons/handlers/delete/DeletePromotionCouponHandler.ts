import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeletePromotionCouponRequest from "./DeletePromotionCouponRequest";


export default class DeletePromotionCouponHandler
{
    public static async delete(request: DeletePromotionCouponRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPromotionCouponDelete, request, true);
        return response;
    }
}
