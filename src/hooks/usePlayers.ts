import { useQuery } from "@tanstack/react-query";
import { generateMockPlayers } from "../mock/fakePlayer";
import { PlayerService } from "../services/api/players";

const MOCK_COUNT = 160;

export const usePlayers = () => {
  const isMocking = import.meta.env.VITE_MOCKING === "true";

  return useQuery({
    queryKey: ["players", MOCK_COUNT],
    queryFn: isMocking
      ? () => generateMockPlayers(MOCK_COUNT)
      : PlayerService.getPlayers,
  });
};
