export interface Player {
  id: number;
  name: string;
  surname: string;
  ciId: string;
  birthDate: string;
  teamName: string;
}

export interface SquadGroup {
  name: string;
  players: Player[];
}
