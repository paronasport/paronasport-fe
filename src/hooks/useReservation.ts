import { useMutation } from "@tanstack/react-query";
import type { SquadGroup } from "../types/types";
import { RegistrationService } from "../services/api/datas";

interface UseRegistrationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useRegistration = (options?: UseRegistrationOptions) => {
  const isMocking = import.meta.env.VITE_MOCKING === "true";

  return useMutation({
    mutationFn: isMocking
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_data: SquadGroup) => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      : (data: SquadGroup) => RegistrationService.postTeams(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
