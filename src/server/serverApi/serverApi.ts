import api from "@services/axiosInstance";
import { HealthResponse } from "@/server/serverTypes/serverTypes"


export const checkServerHealth = async (): Promise<HealthResponse> => {
    const res = await api.get<HealthResponse>( "/health" );

    return res.data;
  };