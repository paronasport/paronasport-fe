import type { Player } from "../../types/types";
import { httpClient } from "../client/httpClient";

export const PlayerService = {
  getPlayers: (): Promise<Player[]> => httpClient.get("/api/players"),
};
