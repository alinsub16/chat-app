import api from "@services/axiosInstance";
import { ProofreadRequest, ProofreadResponse } from "@/features/ai/types/proofreadTypes";

export const proofreadText = async (
  data: ProofreadRequest
): Promise<ProofreadResponse> => {
  const res = await api.post<ProofreadResponse>("/ai/proofread", data);
  return res.data;
};