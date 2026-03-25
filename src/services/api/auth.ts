import { httpClient } from "../client/httpClient";

export const AuthService = {
  login: (
    username: string,
    password: string,
    url: string,
  ): Promise<{ success: boolean; token: string }> =>
    httpClient.post(`/api/login/${url}`, { username, password }, true),
};
