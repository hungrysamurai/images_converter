import styled from "styled-components";

import { useDispatch } from "react-redux";

import { updateActiveFormatSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

const CheckboxInput = ({ currentValue }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(
      updateActiveFormatSettings({
        property: e.target.name,
        value: e.target.checked,
      })
    );
  };

  return (
    <StyledCheckboxContainer>
      <StyledCheckboxDescription>Resize:</StyledCheckboxDescription>

      <StyledToggleWrapper>
        <StyledToggler>
          <StyledInputCheckbox
            type="checkbox"
            name="resize"
            onChange={handleChange}
            checked={currentValue}
          />

          <StyledTogglerBall></StyledTogglerBall>
        </StyledToggler>
      </StyledToggleWrapper>

      <StyledCheckboxDisplayValue>
        {currentValue ? "On" : "Off"}
      </StyledCheckboxDisplayValue>
    </StyledCheckboxContainer>
  );
};

const StyledCheckboxContainer = styled.div`
  width: 100%;
  margin: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCheckboxDescription = styled.p`
  font-size: 1.5rem;
  margin-right: 1rem;
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
    content: "";
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
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 2rem;
  margin-left: 1rem;

  @media (max-width: 500px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

export default CheckboxInput;
