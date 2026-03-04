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

  const isFormValid = useMemo(
    () =>
      hasPlayers &&
      squadName.trim() !== "" &&
      players.every(
        (p) =>
          p.name.trim() !== "" &&
          p.surname.trim() !== "" &&
          p.ciId.trim() !== "" &&
          p.birthDate.trim() !== "",
      ),
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
    <Container>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-8 flex flex-col gap-4"
      >
        <Label
          label="Registrazione Squadra"
          tag={LabelTags.h2}
          weight={TextWeight.bold}
          color={ColorVariants.text.grayDark}
          size={TextDimensions.xlarge}
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
        {hasPlayers &&
          players.map((player, idx) => {
            const isOpen = openIndexes.has(idx);
            const label = player.name.trim()
              ? player.name
              : `Giocatore ${idx + 1}`;

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden relative"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Label
                    label={label}
                    tag={LabelTags.p}
                    weight={TextWeight.semibold}
                    color={ColorVariants.text.grayDark}
                    noMargin
                  />
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                      ? "max-h-[500px] opacity-100 overflow-visible"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="flex flex-col gap-3 p-4">
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
          <Label
            label={error}
            tag={LabelTags.p}
            color={ColorVariants.text.red}
            weight={TextWeight.semibold}
            noMargin
          />
        )}
        {isSuccess && (
          <Label
            label="Dati inviati correttamente"
            tag={LabelTags.p}
            color={ColorVariants.text.green}
            weight={TextWeight.semibold}
            noMargin
          />
        )}

        {hasPlayers && (
          <Button
            label="Invia tutti"
            dimension={ButtonDimensions.large}
            bgColor={ColorVariants.bg.grayDark}
            colorLabel={ColorVariants.text.white}
            onClick={() => {}}
            disabled={!isFormValid}
            fullWidth
          />
        )}
      </form>
    </Container>
  );
};
