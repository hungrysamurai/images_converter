import React, { ChangeEvent, memo } from 'react';
import styled from 'styled-components';

import { Units } from '../../../types/types';

import getClosestMatchedValue from '../../../lib/utils/getClosestMatchesValue';
import { useAppDispatch } from '../../../store/hooks';
import {
  updateActiveTargetFormatNumericSetting,
  updateInputSettings,
} from '../../../store/slices/conversionSettingsSlice/conversionSettingsSlice';

type NumberInputProps = {
  caption: string;
  units: Units;
  min: string | null;
  max: string | null;
  name: NumericOptionsKeys;
  currentValue: number | null;
  active: boolean;
  inputSetting?: boolean;
  step?: string;
};

const NumberInput: React.FC<NumberInputProps> = memo(
  ({ caption, units, min, max, name, active, currentValue, inputSetting, step }) => {
    const dispatch = useAppDispatch();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (newValue < 0 || newValue > Number(max)) return;

      updateState(newValue);
    };

    const checkValue = () => {
      if (step) {
        const newValue = getClosestMatchedValue(currentValue as number, Number(max), Number(step));

        updateState(newValue);
      }
    };

    const updateState = (value: number) => {
      if (inputSetting) {
        dispatch(
          updateInputSettings({
            [name]: value,
          } as NumericOptions),
        );
      } else {
        dispatch(
          updateActiveTargetFormatNumericSetting({
            [name]: value,
          } as NumericOptions),
        );
      }
    };

    return (
      <StyledNumberContainer className={!active ? 'inactive' : ''}>
        <StyledNumberInput
          type="number"
          placeholder={currentValue ? currentValue.toString() : 'auto'}
          value={currentValue ? currentValue : ''}
          onChange={handleChange}
          onBlur={checkValue}
          max={max ? max : ''}
          min={min ? min : '1'}
          name={name}
          step={step ? step : ''}
        />

        {caption && <StyledNumberInputCaption>{caption}</StyledNumberInputCaption>}

        {units && (
          <StyledInputUnitsLabel>
            {units === Units.PIXELS ? 'px' : units === Units.PERCENTAGES ? '%' : units}
          </StyledInputUnitsLabel>
        )}
      </StyledNumberContainer>
    );
  },
);

const StyledNumberContainer = styled.label`
  margin: 0.5rem 0;
  position: relative;

  &.inactive {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledNumberInput = styled.input`
  width: 6rem;
  min-height: 3rem;
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
`;

const StyledNumberInputCaption = styled.span`
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-dark-gray);
  font-size: 0.75rem;
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
