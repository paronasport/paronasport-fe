import { httpClient } from "../client/httpClient";

export const AuthService = {
  login: (
    username: string,
    password: string,
  ): Promise<{ success: boolean; token: string }> =>
    httpClient.post("/api/login/", { username, password }, true),
};
