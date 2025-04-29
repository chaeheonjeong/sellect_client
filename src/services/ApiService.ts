import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '../context/AuthContext';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // 쿠키를 포함한 요청 허용
});

// API 요청 시 사용할 커스텀 훅 (컨텍스트에서 토큰 가져오기)
const useApiService = () => {
  const { accessToken, logout } = useAuth();

  // 요청 인터셉터: Authorization 헤더 추가
  apiClient.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // 응답 인터셉터: 토큰 만료 시 처리
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // 토큰 만료 시 로그아웃 처리
        logout();
      }
      return Promise.reject(error);
    }
  );


  // 공통 API 메서드
  const get = (
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.get(url, config);
  const post = <D>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.post(url, data, config);
  const put = <D>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.put(url, data, config);
  const del = (
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.delete(url, config);
  const patch = <D>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.patch(url, data, config);

  return { get, post, put, del, patch };
};

export default useApiService;
