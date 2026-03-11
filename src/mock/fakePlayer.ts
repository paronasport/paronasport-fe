import { faker } from "@faker-js/faker/locale/it";
import type { Player, SquadGroup } from "../types/types";

const squadNames = Array.from(
  { length: 20 },
  () => `${faker.location.city()} FC`,
);

export const generateMockPlayers = (count: number): SquadGroup[] => {
  const guaranteed = squadNames.flatMap((squadName) =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: faker.person.firstName("male"),
      surname: faker.person.lastName(),
      ciId: faker.string.alphanumeric({ length: 16, casing: "upper" }),
      birthDate: faker.date
        .birthdate({ min: 1985, max: 2005, mode: "year" })
        .toISOString()
        .split("T")[0],
      teamName: squadName,
    })),
  );

  const extra = Math.max(0, count - guaranteed.length);
  const extraPlayers = Array.from({ length: extra }, (_, i) => ({
    id: guaranteed.length + i,
    name: faker.person.firstName("male"),
    surname: faker.person.lastName(),
    ciId: faker.string.alphanumeric({ length: 16, casing: "upper" }),
    birthDate: faker.date
      .birthdate({ min: 1985, max: 2005, mode: "year" })
      .toISOString()
      .split("T")[0],
    teamName: faker.helpers.arrayElement(squadNames),
  }));

  const allPlayers = [...guaranteed, ...extraPlayers];

  // Raggruppa per squadra
  const grouped = allPlayers.reduce<Record<string, Player[]>>((acc, player) => {
    if (!acc[player.teamName]) acc[player.teamName] = [];
    acc[player.teamName].push(player);
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, players]) => ({ name, players }));
};
