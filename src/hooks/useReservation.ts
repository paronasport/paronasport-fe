import { useMutation } from "@tanstack/react-query";
import type { Player } from "../types/types";
import { RegistrationService } from "../services/api/datas";

export const useRegistration = () => {
  const isMocking = import.meta.env.VITE_MOCKING === "true";

  return useMutation({
    mutationFn: isMocking
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_data: Player) => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      : (data: Player) => RegistrationService.submitData(data),
  });
};
