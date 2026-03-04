import {
  LabelTags,
  TextDimensions,
  TextWeight,
  type ButtonDimensionsConst,
} from "../../types/constant";
import { ColorVariants } from "../../utils/utils";
import { Label } from "./Label";

interface ButtonProps {
  icon?: React.ReactNode;
  onClick: () => void;
  dimension: ButtonDimensionsConst;
  label?: string;
  colorIcon?: string;
  bgColor?: string;
  fullWidth?: boolean;
  borderColor?: string;
  colorLabel?: string;
  disabled?: boolean;
}

export const Button = ({
  icon,
  onClick,
  dimension,
  label,
  colorIcon,
  bgColor,
  fullWidth,
  borderColor = ColorVariants.border.transparent,
  colorLabel,
  disabled,
}: ButtonProps) => {
  const full = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      className={`${dimension} flex items-center justify-center rounded-lg ${colorIcon} ${bgColor} border ${borderColor} ${full} outline-none cursor-pointer transition-opacity duration-200
        disabled:opacity-40 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {icon}
      {label && (
        <Label
          label={label}
          tag={LabelTags.p}
          size={TextDimensions.medium}
          noMargin
          weight={TextWeight.bold}
          color={colorLabel}
          additionalClasses={icon ? "ml-1" : ""}
        />
      )}
    </button>
  );
};
