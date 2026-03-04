import { useMemo, useState } from "react";
import { Button } from "../components/core/Button";
import { Container } from "../components/core/Container";
import { Input } from "../components/core/Input";
import { Label } from "../components/core/Label";
import {
  ButtonDimensions,
  LabelTags,
  TextDimensions,
  TextWeight,
} from "../types/constant";
import { ColorVariants } from "../utils/utils";
import { DatePicker } from "../components/core/DatePicker";
import { useRegistration } from "../hooks/useReservation";

type PlayerForm = {
  name: string;
  surname: string;
  ciId: string;
  birthDate: string;
};

const isPlayerComplete = (p: PlayerForm) =>
  p.name.trim() !== "" &&
  p.surname.trim() !== "" &&
  p.ciId.trim() !== "" &&
  p.birthDate.trim() !== "";

export const SendData = () => {
  const [squadName, setSquadName] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<string>("");
  const [playerData, setPlayerData] = useState<Record<number, PlayerForm>>({});
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");

  const {
    mutate: submitRegistration,
    isSuccess,
    isError,
  } = useRegistration({
    onSuccess: () => {
      setSquadName("");
      setPlayerCount("");
      setPlayerData({});
      setOpenIndexes(new Set());
    },
  });

  const count = Number.parseInt(playerCount);
  const hasPlayers = !Number.isNaN(count) && count > 0;

  const players = useMemo(
    () =>
      Array.from({ length: hasPlayers ? count : 0 }, (_, i) => ({
        name: playerData[i]?.name ?? "",
        surname: playerData[i]?.surname ?? "",
        ciId: playerData[i]?.ciId ?? "",
        birthDate: playerData[i]?.birthDate ?? "",
      })),
    [count, hasPlayers, playerData],
  );

  const completedCount = players.filter(isPlayerComplete).length;

  const isFormValid = useMemo(
    () =>
      hasPlayers && squadName.trim() !== "" && players.every(isPlayerComplete),
    [players, squadName, hasPlayers],
  );

  const updatePlayer = (
    index: number,
    field: keyof PlayerForm,
    value: string,
  ) => {
    setPlayerData((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      submitRegistration(players.map((player) => ({ ...player, squadName })));
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Container>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto py-3 flex flex-col gap-5"
        >
          <div className="mb-2">
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
              label="Registrazione Giocatori"
              tag={LabelTags.h1}
              color={ColorVariants.text.white}
              additionalClasses="tracking-tight"
              weight={TextWeight.bold}
              size={TextDimensions.xxlarge}
              noMargin
            />
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur">
            <Label
              label="Dati Squadra"
              tag={LabelTags.p}
              color={ColorVariants.text.grayMedium}
              additionalClasses="tracking-[0.2em] uppercase"
              weight={TextWeight.semibold}
              size={TextDimensions.xsmall}
              noMargin
            />
            <Input
              type="text"
              placeholder="Nome squadra"
              value={squadName}
              setValue={setSquadName}
            />
            <Input
              type="number"
              placeholder="Numero di giocatori"
              value={playerCount}
              setValue={setPlayerCount}
            />
          </div>

          {hasPlayers && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <Label
                  label="Giocatori compilati"
                  tag={LabelTags.p}
                  color={ColorVariants.text.grayMedium}
                  additionalClasses="tracking-wide uppercase"
                  weight={TextWeight.semibold}
                  size={TextDimensions.xsmall}
                  noMargin
                />
                <Label
                  label={`${completedCount} / ${count}`}
                  tag={LabelTags.p}
                  color={ColorVariants.text.emerald}
                  weight={TextWeight.bold}
                  size={TextDimensions.xsmall}
                  noMargin
                />
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / count) * 100}%` }}
                />
              </div>
            </div>
          )}

          {hasPlayers &&
            players.map((player, idx) => {
              const isOpen = openIndexes.has(idx);
              const complete = isPlayerComplete(player);
              const label = player.name.trim()
                ? player.name
                : `Giocatore ${idx + 1}`;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur relative transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                          complete
                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            : "bg-slate-600"
                        }`}
                      />
                      <Label
                        label={label}
                        tag={LabelTags.p}
                        color={ColorVariants.text.white}
                        additionalClasses="tracking-wide"
                        weight={TextWeight.semibold}
                        size={TextDimensions.small}
                        noMargin
                      />
                      {complete && (
                        <Label
                          label="Completo"
                          tag={LabelTags.p}
                          color={ColorVariants.text.emerald}
                          additionalClasses="border border-emerald-400/30 px-2 py-0.5 rounded-full"
                          weight={TextWeight.semibold}
                          size={TextDimensions.xsmall}
                          noMargin
                        />
                      )}
                    </div>
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
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[600px] opacity-100 overflow-visible"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="flex flex-col gap-3 px-5 pb-5 pt-1">
                      <div className="h-px bg-slate-700/50 mb-1" />
                      <Input
                        type="text"
                        placeholder="Nome"
                        value={player.name}
                        setValue={(v) => updatePlayer(idx, "name", v)}
                      />
                      <Input
                        type="text"
                        placeholder="Cognome"
                        value={player.surname}
                        setValue={(v) => updatePlayer(idx, "surname", v)}
                      />
                      <Input
                        type="text"
                        placeholder="Numero carta d'identità"
                        value={player.ciId}
                        setValue={(v) => updatePlayer(idx, "ciId", v)}
                      />
                      <DatePicker
                        onConfirm={(date: Date) =>
                          updatePlayer(idx, "birthDate", date.toString())
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {isError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <Label
                label={error || "Errore durante l'invio"}
                tag={LabelTags.p}
                color={ColorVariants.text.red}
                weight={TextWeight.semibold}
                noMargin
              />
            </div>
          )}
          {isSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
              <Label
                label="Dati inviati correttamente ✓"
                tag={LabelTags.p}
                color={ColorVariants.text.green}
                weight={TextWeight.semibold}
                noMargin
              />
            </div>
          )}

          {hasPlayers && (
            <Button
              label={
                isFormValid
                  ? "Invia tutti i giocatori"
                  : `Completa tutti i campi (${completedCount}/${count})`
              }
              dimension={ButtonDimensions.large}
              bgColor={ColorVariants.bg.grayDark}
              colorLabel={ColorVariants.text.white}
              borderColor={"border-emerald-500/30"}
              onClick={() => {}}
              disabled={!isFormValid}
              additionalClass={"mt-5"}
              fullWidth
            />
          )}
        </form>
      </Container>
    </div>
  );
};
