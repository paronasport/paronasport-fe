import type { SquadGroup } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const RegistrationService = {
  postTeams: (data: SquadGroup): Promise<void> =>
    httpClient.post("/api/teams/", data),
};
