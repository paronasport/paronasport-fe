import { useMutation } from "@tanstack/react-query";
import type { SquadGroupPayload } from "../types/types";
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
        async (_data: SquadGroupPayload) => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      : (data: SquadGroupPayload) => RegistrationService.postTeams(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
