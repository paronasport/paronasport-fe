import { faker } from "@faker-js/faker/locale/it";
import type { Player } from "../types/types";

const squadNames = [
  "Juventus FC",
  "AC Milan",
  "Inter Milano",
  "AS Roma",
  "SSC Napoli",
];

export const generateMockPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, () => ({
    name: faker.person.firstName("male"),
    surname: faker.person.lastName(),
    ciId: faker.string.alphanumeric({ length: 16, casing: "upper" }),
    birthDate: faker.date
      .birthdate({ min: 1985, max: 2005, mode: "year" })
      .toISOString()
      .split("T")[0],
    squadName: faker.helpers.arrayElement(squadNames),
  }));
};
