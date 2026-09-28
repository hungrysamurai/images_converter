import React, { ChangeEvent, memo } from 'react';
import styled from 'styled-components';

import getClosestMatchedValue from '@/lib/utils/getClosestMatchesValue';
type NumberInputProps = {
  caption: string;
  suffix?: string;
  min: number;
  max: number;
  step?: number;
  value: number | null;
  active: boolean;
  onChange: (value: number) => void;
};

const NumberInput: React.FC<NumberInputProps> = memo(
  ({ caption, suffix, min, max, step, value, active, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (newValue < 0 || newValue > max) return;

      onChange(newValue);
    };

    const checkValue = () => {
      if (step) {
        onChange(getClosestMatchedValue(value ?? 0, max, step));
      }
    };

    return (
      <StyledNumberContainer className={!active ? 'inactive' : ''}>
        <StyledNumberInput
          type="number"
          placeholder={value ? value.toString() : 'auto'}
          value={value ? value : ''}
          onChange={handleChange}
          onBlur={checkValue}
          max={max}
          min={min}
          step={step}
        />

        {caption && <StyledNumberInputCaption>{caption}</StyledNumberInputCaption>}

        {suffix && <StyledInputUnitsLabel>{suffix}</StyledInputUnitsLabel>}
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
