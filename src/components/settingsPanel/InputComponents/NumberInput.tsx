import styled from "styled-components";

import { updateActiveFormatNumericSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";
import { updateInputSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";
import { useAppDispatch } from "../../../store/hooks";
import { ResizeUnits } from "../../../types";
import React, { ChangeEvent } from "react";

type NumberInputProps = {
  caption: string;
  units: ResizeUnits;
  min: string | null;
  max: string | null;
  name: NumericOptionsKeys;
  currentValue: number | null;
  active: boolean;
  inputSetting?: boolean;
};

const NumberInput: React.FC<NumberInputProps> = ({
  caption,
  units,
  min,
  max,
  name,
  active,
  currentValue,
  inputSetting,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);

    if (newValue < 0 || newValue > Number(max)) return;

    if (inputSetting) {
      dispatch(
        updateInputSettings({
          [e.target.name]: Number(e.target.value),
        } as NumericOptions)
      );
    }

    dispatch(
      updateActiveFormatNumericSettings({
        [e.target.name]: Number(e.target.value),
      } as NumericOptions)
    );
  };

  return (
    <StyledNumberContainer className={!active ? "inactive" : ""}>
      <StyledNumberInput
        type="number"
        placeholder={currentValue ? currentValue.toString() : "auto"}
        value={currentValue ? currentValue : ""}
        onChange={handleChange}
        max={max ? max : ""}
        min={min ? min : "1"}
        name={name}
      />

      {caption && (
        <StyledNumberInputCaption>{caption}</StyledNumberInputCaption>
      )}

      {units && (
        <StyledInputUnitsLabel>
          {units === ResizeUnits.PIXELS
            ? "px"
            : units === ResizeUnits.PERCENTAGES
            ? "%"
            : units}
        </StyledInputUnitsLabel>
      )}
    </StyledNumberContainer>
  );
};

const StyledNumberContainer = styled.label`
  margin: 1rem;
  position: relative;

  &.inactive {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledNumberInput = styled.input`
  width: 6rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.5rem;
  font-family: inherit;
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;

  -moz-appearance: textfield;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const StyledNumberInputCaption = styled.span`
  position: absolute;
  bottom: -1.25rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-dark-gray);
  font-size: 1rem;
`;

const StyledInputUnitsLabel = styled.div`
  position: absolute;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  right: -2.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dark-gray);
  font-size: 1rem;
`;

export default NumberInput;
