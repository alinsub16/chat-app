import { useEffect, useState } from "react";
import { checkServerHealth } from "@/server/serverApi/serverApi";

interface UseServerWakeReturn {
  loading: boolean;
  serverReady: boolean;
  serverError: boolean;
  retry: () => Promise<void>;
}

export const useServerWake = (): UseServerWakeReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [serverReady, setServerReady] =
    useState<boolean>(false);
  const [serverError, setServerError] =
    useState<boolean>(false);

  useEffect(() => {
    wakeServer();
  }, []);

  const wakeServer = async (): Promise<void> => {
    try {
      setLoading(true);
      setServerError(false);

      let retries = 10;

      while (retries > 0) {
        try {
          await checkServerHealth();

          setServerReady(true);
          setServerError(false);

          return;
        } catch (err: unknown) {
          retries--;

          await new Promise((resolve) =>
            setTimeout(resolve, 3000)
          );
        }
      }

      setServerReady(false);
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    serverReady,
    serverError,
    retry: wakeServer,
  };
};