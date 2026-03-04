import { useState } from "react";
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

export const SendData = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [ciId, setCiId] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [error, setError] = useState<string>("");
  const { mutate: submitRegistration, isSuccess, isError } = useRegistration();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      submitRegistration({ name, surname, ciId, birthDate });
    } catch (err){
      setError(err as string)
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-8 flex flex-col gap-4"
      >
        <Label
          label="Dati del giocatore"
          tag={LabelTags.h2}
          weight={TextWeight.bold}
          color={ColorVariants.text.grayDark}
          size={TextDimensions.xlarge}
          noMargin
        />
        <Input
          type={"text"}
          placeholder={"Nome"}
          value={name}
          setValue={setName}
        />
        <Input
          type={"text"}
          placeholder={"Cognome"}
          value={surname}
          setValue={setSurname}
        />
        <Input
          type={"text"}
          placeholder={"Numero carta d'identità"}
          value={ciId}
          setValue={setCiId}
        />
        <DatePicker onConfirm={(date: Date) => setBirthDate(date)} />
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
            label={"Dati inviati correttamente"}
            tag={LabelTags.p}
            color={ColorVariants.text.green}
            weight={TextWeight.semibold}
            noMargin
          />
        )}
        <Button
          label="Invia"
          dimension={ButtonDimensions.large}
          bgColor={ColorVariants.bg.grayDark}
          colorLabel={ColorVariants.text.white}
          onClick={() => {}}
          fullWidth
        />
      </form>
    </Container>
  );
};
