import styled from 'styled-components';
import React, { ChangeEvent, memo } from 'react';

type CheckboxInputProps = {
  value: boolean;
  displayValueOn: string;
  displayValueOff: string;
  label: string;
  onChange: (value: boolean) => void;
};

const CheckboxInput: React.FC<CheckboxInputProps> = memo(
  ({ value, displayValueOn, displayValueOff, label, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <StyledCheckboxContainer>
        <StyledCheckboxDescription>{label}</StyledCheckboxDescription>

        <StyledToggleWrapper>
          <StyledToggler>
            <StyledInputCheckbox type="checkbox" onChange={handleChange} checked={value} />

            <StyledTogglerBall />
          </StyledToggler>
        </StyledToggleWrapper>

        <StyledCheckboxDisplayValue>
          {value ? displayValueOn : displayValueOff}
        </StyledCheckboxDisplayValue>
      </StyledCheckboxContainer>
    );
  },
);

const StyledCheckboxContainer = styled.div`
  width: 100%;
  margin: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    flex-wrap: wrap;
  }
`;

const StyledCheckboxDescription = styled.p`
  font-size: 1.5rem;
  margin-right: 1rem;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    font-size: 1rem;
    font-weight: 700;
  }
`;

const StyledToggleWrapper = styled.div`
  z-index: 1;
  align-items: center;
  display: flex;
`;

const StyledToggler = styled.label`
  display: inline-block;
  height: 1.75rem;
  position: relative;
  width: 3rem;
`;

const StyledInputCheckbox = styled.input`
  display: none;
`;

const StyledTogglerBall = styled.div`
  background: var(--element-medium-gray);
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.4s;
  border-radius: 2rem;

  &::before {
    content: '';
    background: var(--element-light-gray);
    bottom: 0.25rem;
    height: 1.25rem;
    left: 0.25rem;
    position: absolute;
    transition: 0.25s;
    width: 1.25rem;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
    border-radius: 2rem;
  }

  ${StyledInputCheckbox}:checked + &::before {
    background: var(--element-dark-gray);
    transform: translateX(1.25rem) scale(1.2);
  }
`;

const StyledCheckboxDisplayValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5rem;
  margin-left: 0.5rem;
  width: 10%;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    font-size: 1rem;
    font-weight: 700;
    margin-left: 0.5rem;
    justify-content: center;
  }
`;

export default CheckboxInput;
