import { type FormEvent, useMemo, useState } from "react";
import { Button } from "../components/core/Button";
import { Container } from "../components/core/Container";
import { Input } from "../components/core/Input";
import { Label } from "../components/core/Label";
import { Loader } from "../components/core/Loader";
import {
  ButtonDimensions,
  LabelTags,
  TextDimensions,
  TextWeight,
} from "../types/constant";
import { ColorVariants } from "../utils/utils";
import { DatePicker } from "../components/core/DatePicker";
import { useRegistration } from "../hooks/useReservation";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

const cardStyle = {
  background: "color-mix(in oklab, oklch(1 0 0) 70%, transparent)",
};

export const SendData = () => {
  const MIN_PLAYERS = 6;
  const MAX_PLAYERS = 10;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputName, setInputName] = useState<string>("");
  const [squadName, setSquadName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const [playerCount, setPlayerCount] = useState<string>("");
  const [playerData, setPlayerData] = useState<Record<number, PlayerForm>>({});
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");

  const count = Number.parseInt(playerCount);
  const hasPlayers =
    !Number.isNaN(count) && count >= MIN_PLAYERS && count <= MAX_PLAYERS;

  const countError =
    playerCount !== "" &&
    (count < MIN_PLAYERS
      ? `Minimo ${MIN_PLAYERS} giocatori`
      : count > MAX_PLAYERS
        ? `Massimo ${MAX_PLAYERS} giocatori`
        : "");

  const navigate = useNavigate();

  const { mutate: login, isPending: isLoginPending } = useAuth();

  const {
    mutate: submitRegistration,
    isSuccess,
    isError,
  } = useRegistration({
    onSuccess: () => {
      setPlayerCount("");
      setPlayerData({});
      setOpenIndexes(new Set());
    },
  });

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

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    login(
      { username: inputName, password, url: "teams" },
      {
        onSuccess: ({ token }) => {
          localStorage.setItem("auth_token", token);
          setIsLoggedIn(true);
        },
        onError: () => {
          setLoginError("Nome squadra o password errati");
        },
      },
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      submitRegistration(
        {
          name: squadName,
          players: players.map((player) => ({ ...player })),
        },
        {
          onSuccess: () => {
            navigate("/login");
          },
        },
      );
    } catch (err) {
      setError(err as string);
    }
  };

  const bgWrapper = {
    backgroundImage: "url('/img/bg.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={bgWrapper}
      >
        <Container>
          {isLoginPending ? (
            <Loader />
          ) : (
            <form
              onSubmit={handleLogin}
              className="max-w-sm mx-auto flex flex-col gap-5"
            >
              <div className="mb-2">
                <Label
                  label={"Accesso Squadra".toUpperCase()}
                  tag={LabelTags.h3}
                  color={ColorVariants.text.white}
                  additionalClasses="tracking-tight mt-14 text-center"
                  weight={TextWeight.bold}
                  size={TextDimensions.xlarge}
                  noMargin
                />
              </div>

              <div
                className="border border-white rounded-2xl p-5 flex flex-col gap-4 backdrop-blur"
                style={cardStyle}
              >
                <Label
                  label="Dati Accesso"
                  tag={LabelTags.p}
                  color={ColorVariants.text.black}
                  additionalClasses="tracking-[0.2em] uppercase"
                  weight={TextWeight.semibold}
                  size={TextDimensions.xsmall}
                  noMargin
                />
                <Input
                  type="text"
                  placeholder="Nome"
                  value={inputName}
                  setValue={setInputName}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  setValue={setPassword}
                />
                {loginError && (
                  <Label
                    label={loginError}
                    tag={LabelTags.p}
                    color={ColorVariants.text.red}
                    weight={TextWeight.semibold}
                    noMargin
                  />
                )}
              </div>

              <Button
                label="Accedi"
                dimension={ButtonDimensions.large}
                colorLabel={ColorVariants.text.black}
                borderColor="border-white"
                onClick={() => {}}
                style={cardStyle}
                disabled={inputName.trim() === "" && password.trim() === ""}
                fullWidth
              />
            </form>
          )}
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={bgWrapper}>
      <Container>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto py-3 flex flex-col gap-5"
        >
          <div className="mb-2">
            <Label
              label={"Registrazione Giocatori".toUpperCase()}
              tag={LabelTags.h3}
              color={ColorVariants.text.white}
              additionalClasses="tracking-tight mt-14 text-center"
              weight={TextWeight.bold}
              size={TextDimensions.xlarge}
              noMargin
            />
          </div>

          <div
            className="border border-white rounded-2xl p-5 flex flex-col gap-4 backdrop-blur"
            style={cardStyle}
          >
            <Label
              label="Dati Squadra"
              tag={LabelTags.p}
              color={ColorVariants.text.black}
              additionalClasses="tracking-[0.2em] uppercase"
              weight={TextWeight.semibold}
              size={TextDimensions.xsmall}
              noMargin
            />
            <Input
              type="text"
              placeholder="Nome"
              value={squadName}
              setValue={setSquadName}
            />
            <Input
              type="number"
              placeholder="Numero di giocatori"
              value={playerCount}
              setValue={(v) => {
                const n = Number.parseInt(v);
                if (v === "" || (n >= 1 && n <= MAX_PLAYERS)) setPlayerCount(v);
              }}
            />
            {countError && (
              <Label
                label={countError}
                tag={LabelTags.p}
                color={ColorVariants.text.red}
                weight={TextWeight.semibold}
                noMargin
              />
            )}
          </div>

          {hasPlayers && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <Label
                  label="Giocatori compilati"
                  tag={LabelTags.p}
                  color={ColorVariants.text.white}
                  additionalClasses="tracking-wide uppercase"
                  weight={TextWeight.bold}
                  size={TextDimensions.xsmall}
                  noMargin
                />
                <Label
                  label={`${completedCount} / ${count}`}
                  tag={LabelTags.p}
                  color={ColorVariants.text.white}
                  weight={TextWeight.bold}
                  size={TextDimensions.xsmall}
                  noMargin
                />
              </div>
              <div className="h-1.5 bg-black rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-white"
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
                  className="rounded-2xl border border-white backdrop-blur relative transition-all duration-300"
                  style={cardStyle}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/20 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                          complete
                            ? "bg-[#e02b2a] shadow-[0_0_8px_#e02b2a]"
                            : "bg-black"
                        }`}
                      />
                      <Label
                        label={label}
                        tag={LabelTags.p}
                        color={ColorVariants.text.black}
                        additionalClasses="tracking-wide"
                        weight={TextWeight.semibold}
                        size={TextDimensions.small}
                        noMargin
                      />
                      {complete && (
                        <Label
                          label="Completo"
                          tag={LabelTags.p}
                          color={ColorVariants.text.red}
                          additionalClasses="border border-[#e02b2a]/30 px-2 py-0.5 rounded-full"
                          weight={TextWeight.semibold}
                          size={TextDimensions.xsmall}
                          noMargin
                        />
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-black transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                      <div className="h-px bg-white/40 mb-1" />
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
                          updatePlayer(
                            idx,
                            "birthDate",
                            new Date(date).toLocaleDateString("it-IT"),
                          )
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
              colorLabel={ColorVariants.text.black}
              borderColor={"border-white"}
              onClick={() => {}}
              disabled={!isFormValid}
              additionalClass={"mt-5"}
              style={cardStyle}
              fullWidth
            />
          )}
        </form>
      </Container>
    </div>
  );
};
