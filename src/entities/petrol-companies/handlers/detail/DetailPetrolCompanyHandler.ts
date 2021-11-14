import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailPetrolCompanyRequest from "./DetailPetrolCompanyRequest";


export default class DetailPetrolCompanyHandler
{
    public static async detail(request: DetailPetrolCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyDetail, request, true);
        return response;
    }
}
