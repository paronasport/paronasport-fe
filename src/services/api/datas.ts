import type { SquadGroupPayload } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const RegistrationService = {
  postTeams: (data: SquadGroupPayload): Promise<void> =>
    httpClient.post("/api/teams/", data),
};
