import { request } from "../request";

import type { TokenInfo, RefreshTokenInfo } from "@/types";

const login = () => {
  return request<{ url: string }>("/auth/login");
};

const getAccessAndRefreshToken = (code: string) => {
  return request.post<TokenInfo>("/auth/token", {
    code,
  });
};

const refreshToken = () => {
  return request.get<RefreshTokenInfo>("/auth/refresh-token");
};

export { login, getAccessAndRefreshToken, refreshToken };
