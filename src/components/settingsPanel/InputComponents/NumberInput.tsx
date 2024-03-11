import PropTypes from "prop-types";

import styled from "styled-components";

import { useDispatch } from "react-redux";
import { updateActiveFormatSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";
import { updateInputSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

const NumberInput = ({
  caption,
  units,
  min,
  max,
  name,
  active,
  currentValue,
  inputSetting,
}) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let newValue = Number(e.target.value);

    if (newValue < 0 || newValue > max) return;

    if (inputSetting) {
      dispatch(
        updateInputSettings({
          property: e.target.name,
          value: newValue,
        })
      );
    }

    dispatch(
      updateActiveFormatSettings({
        property: e.target.name,
        value: newValue,
      })
    );
  };

  return (
    <StyledNumberContainer className={!active && "inactive"}>
      <StyledNumberInput
        type="number"
        placeholder={currentValue ? currentValue : "auto"}
        value={currentValue ? currentValue : ""}
        onChange={handleChange}
        max={max ? max : null}
        min={min ? min : "1"}
        name={name}
      />

      {caption && (
        <StyledNumberInputCaption>{caption}</StyledNumberInputCaption>
      )}

      {units && (
        <StyledInputUnitsLabel>
          {units === "pixels" ? "px" : units === "percentages" ? "%" : units}
        </StyledInputUnitsLabel>
      )}
    </StyledNumberContainer>
  );
};

NumberInput.propTypes = {
  caption: PropTypes.string,
  units: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  name: PropTypes.string,
  active: PropTypes.bool,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputSetting: PropTypes.bool,
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
