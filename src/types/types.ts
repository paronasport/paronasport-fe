export interface Player {
  name: string;
  surname: string;
  ciId: string;
  birthDate: string;
  squadName: string;
}

export interface SquadGroup {
  squadName: string;
  players: Player[];
}
