import { faker } from "@faker-js/faker/locale/it";
import type { Player } from "../types/types";

const squadNames = Array.from(
  { length: 20 },
  () => `${faker.location.city()} FC`,
);

export const generateMockPlayers = (count: number): Player[] => {
  const guaranteed = squadNames.flatMap((squadName) =>
    Array.from({ length: 5 }, () => ({
      name: faker.person.firstName("male"),
      surname: faker.person.lastName(),
      ciId: faker.string.alphanumeric({ length: 16, casing: "upper" }),
      birthDate: faker.date
        .birthdate({ min: 1985, max: 2005, mode: "year" })
        .toISOString()
        .split("T")[0],
      squadName,
    })),
  );

  const extra = Math.max(0, count - guaranteed.length);
  const extraPlayers = Array.from({ length: extra }, () => ({
    name: faker.person.firstName("male"),
    surname: faker.person.lastName(),
    ciId: faker.string.alphanumeric({ length: 16, casing: "upper" }),
    birthDate: faker.date
      .birthdate({ min: 1985, max: 2005, mode: "year" })
      .toISOString()
      .split("T")[0],
    squadName: faker.helpers.arrayElement(squadNames),
  }));

  return faker.helpers.shuffle([...guaranteed, ...extraPlayers]);
};
