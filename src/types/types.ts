export interface PlayerPayload {
  name: string;
  surname: string;
  ciId: string;
  birthDate: string;
}

export interface SquadGroupPayload {
  name: string;
  players: PlayerPayload[];
}

export interface Player extends PlayerPayload {
  id: number;
  teamName: string;
}

export interface SquadGroup {
  name: string;
  players: Player[];
}
