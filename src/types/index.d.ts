declare global {
  type ApiError = {
    message: string;
    statusCode?: number;
  };

  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
}