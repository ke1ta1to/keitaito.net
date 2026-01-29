import "server-only";
import Axios, { AxiosRequestConfig, AxiosError } from "axios";
import { getServiceAccessToken } from "@/lib/cognito-client-credentials";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

AXIOS_INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await getServiceAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
