import type { SquadGroup } from "../types/types";
import * as XLSX from "xlsx-js-style";

export const exportSquadToExcel = (squad: SquadGroup): void => {
  const data = squad.players.map((p) => ({
    "Numeri maglia": "",
    Nome: p.name,
    Cognome: p.surname,
    "Cod. CI": p.ciId,
    "Data di Nascita": p.birthDate,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 25 },
  ];

  // Apply bold formatting to headers
  const headers = Object.keys(data[0]);
  headers.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    worksheet[cellAddress] = {
      ...worksheet[cellAddress],
      font: { bold: true },
    };
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, squad.name.slice(0, 31));
  XLSX.writeFile(workbook, `${squad.name.replace(/\s+/g, "_")}_players.xlsx`);
};

export const exportAllSquadsToExcel = (squads: SquadGroup[]): void => {
  const rows: (string | undefined)[][] = [];
  const merges: XLSX.Range[] = [];

  squads.forEach((squad, squadIndex) => {
    const squadNameRow = rows.length;

    // Squad name row (merged across 5 columns)
    rows.push([squad.name, undefined, undefined, undefined, undefined]);
    merges.push({
      s: { r: squadNameRow, c: 0 },
      e: { r: squadNameRow, c: 4 },
    });

    // Column headers
    rows.push([
      "Numero maglia",
      "Nome",
      "Cognome",
      "Cod. CI",
      "Data di Nascita",
    ]);

    // Player rows
    squad.players.forEach((p) => {
      rows.push(["", p.name, p.surname, p.ciId, p.birthDate]);
    });

    // 3 empty rows between squads (except after last squad)
    if (squadIndex < squads.length - 1) {
      rows.push([], [], []);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  worksheet["!merges"] = merges;
  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
  ];

  // Apply styling to squad name rows (bold + centered)
  merges.forEach((merge) => {
    const cellAddress = XLSX.utils.encode_cell({ r: merge.s.r, c: 0 });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tutti Giocatori");
  XLSX.writeFile(workbook, `tutte_squadre_giocatori.xlsx`);
};
