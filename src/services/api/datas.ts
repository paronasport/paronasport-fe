import type { RegistrationData } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const RegistrationService = {
  submitData: (data: RegistrationData): Promise<void> =>
    httpClient.post("/api/registration", data),
};
