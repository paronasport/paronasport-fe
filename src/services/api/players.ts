import type { SquadGroup } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const PlayerService = {
  getTeams: (): Promise<SquadGroup[]> => httpClient.get("/api/teams/"),
};
