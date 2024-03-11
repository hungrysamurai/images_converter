import { ChangeEvent } from "react";

import styled from "styled-components";

import { useAppDispatch } from "../../../store/hooks";
import { updateActiveFormatSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

type SelectInputProps = {
  options: string[];
  label: string;
  name: keyof GeneralOutputConversionSettings;
  currentValue: string;
  active: boolean;
};

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  label,
  name,
  currentValue,
  active,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    dispatch(
      updateActiveFormatSettings({
        property: e.target.name as keyof GeneralOutputConversionSettings,
        value: e.target.value !== "off" ? e.target.value : false,
      })
    );
  };

  return (
    <StyledInputContainer className={!active ? "inactive" : ""}>
      <StyledLabel>
        {label}
        <StyledSelect onChange={handleChange} name={name} value={currentValue}>
          {options.map((optionName, i) => (
            <option key={i} value={optionName}>
              {optionName}
            </option>
          ))}
        </StyledSelect>
      </StyledLabel>
    </StyledInputContainer>
  );
};

const StyledInputContainer = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;

  &.inactive {
    opacity: 0.5;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    margin: 0.5rem;
  }
`;

const StyledLabel = styled.label`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StyledSelect = styled.select`
  width: 12rem;
  max-width: 80%;
  height: 3rem;
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  background: var(--bg-light-gray);
  cursor: pointer;

  @media (max-width: 768px) {
    width: 80%;
    font-size: 1rem;
  }
`;

export default SelectInput;
