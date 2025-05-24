import axios, {
  Axios,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import { getMessageInfo } from "./status";

interface BaseResponse<T = any> {
  code: number | string;
  data: T;
  message: string;
}

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASEURL,
  timeout: 15000,
});

// axios 实例拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    }
    ElMessage({
      message: getMessageInfo(response.status),
      type: "error",
    });

    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      ElMessage({
        message: getMessageInfo(response.status),
        type: "error",
      });
    }
    return Promise.reject(response.data);
  }
);

// 此处为响应做定制化处理
const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    service
      .request<any, AxiosResponse<BaseResponse<T>>>(conf)
      .then((res: AxiosResponse<BaseResponse<T>>) => {
        const data = res.data;

        if (data.code != 200) {
          ElMessage({
            message: data.message,
            type: "error",
          });
          reject(data.message);
        } else {
          ElMessage({
            message: data.message,
            type: "success",
          });
          resolve(data.data as T);
        }
      });
  });
};

export function get<T, U = any>(
  url: string,
  params?: U,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestInstance<T>({
    ...config,
    url,
    method: "GET",
    params,
  });
}

export function post<T, U = any>(
  url: string,
  data?: U,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestInstance<T>({
    ...config,
    url,
    method: "POST",
    data,
  });
}

export default service;
