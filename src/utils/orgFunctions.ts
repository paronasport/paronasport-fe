import type { SquadGroup } from "../types/types";
import * as XLSX from "xlsx";

export const exportSquadToExcel = (squad: SquadGroup): void => {
  const data = squad.players.map((p) => ({
    Nome: p.name,
    Cognome: p.surname,
    "Cod. CI": p.ciId,
    "Data di Nascita": p.birthDate,
    Squadra: p.name,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, squad.name.slice(0, 31));
  XLSX.writeFile(workbook, `${squad.name.replace(/\s+/g, "_")}_players.xlsx`);
};
