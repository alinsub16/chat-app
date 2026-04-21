import { useState } from "react";
import { proofreadText } from "@features/ai/api/proofreadApi";

export const useProofread = () => {
  const [corrected, setCorrected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proofread = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await proofreadText({ text });
      setCorrected(result.corrected);
    } catch (err) {
      setError("Failed to proofread. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { corrected, loading, error, proofread,setCorrected };
};