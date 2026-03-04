import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { exportSquadToExcel, groupBySquad } from "../utils/orgFunctions";
import { Loader } from "../components/core/Loader";
import { Label } from "../components/core/Label";
import { LabelTags, TextDimensions, TextWeight } from "../types/constant";
import { ColorVariants } from "../utils/utils";

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
            <Label
              label="Gestione Squadra"
              tag={LabelTags.p}
              color={ColorVariants.text.emerald}
              additionalClasses="uppercase mb-1 tracking-[0.3em]"
              weight={TextWeight.normal}
              size={TextDimensions.small}
              noMargin
            />
            <Label
              label="Registro Giocatori"
              tag={LabelTags.h1}
              color={ColorVariants.text.white}
              additionalClasses="tracking-tight"
              weight={TextWeight.bold}
              size={TextDimensions.xxlarge}
              noMargin
            />
            <div className="mt-2 flex items-center gap-3">
              <Label
                label={`${squads.length} squadre`}
                tag={LabelTags.p}
                color={ColorVariants.text.grayMedium}
                size={TextDimensions.small}
                noMargin
              />
              <Label
                label="·"
                tag={LabelTags.p}
                color={ColorVariants.text.grayDark}
                noMargin
              />
              <Label
                label={`${squads.reduce((acc, s) => acc + s.players.length, 0)} giocatori`}
                tag={LabelTags.p}
                color={ColorVariants.text.grayMedium}
                size={TextDimensions.small}
                noMargin
              />
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
                    className="cursor-pointer w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <Label
                        label={squad.squadName}
                        tag={LabelTags.p}
                        color={ColorVariants.text.white}
                        weight={TextWeight.semibold}
                        size={TextDimensions.small}
                        additionalClasses="tracking-wide"
                        noMargin
                      />
                      <Label
                        label={`${squad.players.length} giocatori`}
                        tag={LabelTags.p}
                        color={ColorVariants.text.grayMedium}
                        size={TextDimensions.xsmall}
                        additionalClasses="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700"
                        noMargin
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSquadToExcel(squad);
                        }}
                        className="cursor-pointer flex flex-row items-center gap-1.5 text-xs text-emerald-400 border border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10 px-3 py-1.5 rounded-lg transition-all duration-200"
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
                        <Label
                          label="Excel"
                          tag={LabelTags.p}
                          color={ColorVariants.text.emerald}
                          size={TextDimensions.xsmall}
                          noMargin
                        />
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
                      <div className="grid grid-cols-4 gap-3 border-b border-slate-700/50 pb-2 mb-1">
                        <Label
                          label="Nome"
                          tag={LabelTags.p}
                          color={ColorVariants.text.grayMedium}
                          size={TextDimensions.xsmall}
                          additionalClasses="uppercase"
                          noMargin
                        />
                        <Label
                          label="Cognome"
                          tag={LabelTags.p}
                          color={ColorVariants.text.grayMedium}
                          size={TextDimensions.xsmall}
                          additionalClasses="uppercase"
                          noMargin
                        />
                        <Label
                          label="Cod. CI"
                          tag={LabelTags.p}
                          color={ColorVariants.text.grayMedium}
                          size={TextDimensions.xsmall}
                          additionalClasses="uppercase"
                          noMargin
                        />
                        <Label
                          label="Data Nascita"
                          tag={LabelTags.p}
                          color={ColorVariants.text.grayMedium}
                          size={TextDimensions.xsmall}
                          additionalClasses="uppercase"
                          noMargin
                        />
                      </div>

                      {squad.players.map((player, idx) => (
                        <div
                          key={`${player.ciId}-${idx}`}
                          className="grid grid-cols-4 gap-3 py-2.5 border-b border-slate-800/50 last:border-0 rounded px-1"
                        >
                          <Label
                            label={player.name}
                            tag={LabelTags.p}
                            color={ColorVariants.text.white}
                            size={TextDimensions.small}
                            noMargin
                          />
                          <Label
                            label={player.surname}
                            tag={LabelTags.p}
                            color={ColorVariants.text.white}
                            size={TextDimensions.small}
                            noMargin
                          />
                          <Label
                            label={player.ciId}
                            tag={LabelTags.p}
                            color={ColorVariants.text.white}
                            size={TextDimensions.small}
                            noMargin
                          />
                          <Label
                            label={player.birthDate}
                            tag={LabelTags.p}
                            color={ColorVariants.text.white}
                            size={TextDimensions.small}
                            additionalClasses="font-mono"
                            noMargin
                          />
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
