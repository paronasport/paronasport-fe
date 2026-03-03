import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/api/auth";
import { fakeLogin } from "../mock/fakeLogin";

export const useAuth = () => {
  const isMocking = import.meta.env.VITE_MOCKING === "true";

  return useMutation({
    mutationFn: isMocking
      ? ({ username, password }: { username: string; password: string }) =>
          fakeLogin(username, password)
      : ({ username, password }: { username: string; password: string }) =>
          AuthService.login(username, password),
  });
};
