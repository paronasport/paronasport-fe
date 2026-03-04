import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { exportSquadToExcel, groupBySquad } from "../utils/orgFunctions";
import { Loader } from "../components/core/Loader";

export const AdminDashboard = () => {
  const [openSquads, setOpenSquads] = useState<Set<string>>(new Set());
  const { data: players = [], isLoading } = usePlayers();
  const squads = groupBySquad(players);

  const toggleSquad = (squadName: string) => {
    setOpenSquads((prev) => {
      const next = new Set(prev);
      if (next.has(squadName)) {
        next.delete(squadName);
      } else {
        next.add(squadName);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6 font-mono">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-emerald-400 uppercase mb-1">
              Gestione Squadre
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Registro Giocatori
            </h1>
            <div className="mt-2 flex items-center gap-3 text-slate-400 text-sm">
              <span>{squads.length} squadre</span>
              <span className="text-slate-600">·</span>
              <span>
                {squads.reduce((acc, s) => acc + s.players.length, 0)} giocatori
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {squads.map((squad) => {
              const isOpen = openSquads.has(squad.squadName);
              return (
                <div
                  key={squad.squadName}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleSquad(squad.squadName)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span className="text-white font-semibold text-sm tracking-wide">
                        {squad.squadName}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                        {squad.players.length} giocatori
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSquadToExcel(squad);
                        }}
                        className="flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10 px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Excel
                      </button>

                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5">
                      <div className="grid grid-cols-4 gap-3 text-[10px] tracking-[0.15em] uppercase text-slate-500 border-b border-slate-700/50 pb-2 mb-1">
                        <span>Nome</span>
                        <span>Cognome</span>
                        <span>Cod. CI</span>
                        <span>Data Nascita</span>
                      </div>

                      {squad.players.map((player, idx) => (
                        <div
                          key={`${player.ciId}-${idx}`}
                          className="grid grid-cols-4 gap-3 py-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 rounded px-1 transition-colors duration-150"
                        >
                          <span className="text-sm text-white">
                            {player.name}
                          </span>
                          <span className="text-sm text-white">
                            {player.surname}
                          </span>
                          <span className="text-sm text-slate-400 font-mono text-xs">
                            {player.ciId}
                          </span>
                          <span className="text-sm text-slate-400">
                            {player.birthDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
