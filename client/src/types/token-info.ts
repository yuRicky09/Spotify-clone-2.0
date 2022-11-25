export interface TokenInfo {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export type RefreshTokenInfo = Omit<TokenInfo, "refreshToken">;
