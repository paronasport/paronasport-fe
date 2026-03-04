import type { Player } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const RegistrationService = {
  submitData: (data: Player[]): Promise<void> =>
    httpClient.post("/api/registration", data),
};
