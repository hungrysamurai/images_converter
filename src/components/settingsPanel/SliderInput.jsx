import styled from "styled-components";
import { useState } from "react";

const SliderInput = ({ defaultValue }) => {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const handleSliderChange = (e) => {
    console.log(e.target.value);
    setSliderValue(e.target.value);
  };

  return (
    <StyledSliderContainer>
      <StyledSliderLabel>
        Quality:
        <StyledSlider
          type="range"
          min="1"
          max="100"
          onChange={(e) => {
            handleSliderChange(e);
          }}
          value={sliderValue}
        />
      </StyledSliderLabel>
    </StyledSliderContainer>
  );
};

const StyledSliderContainer = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem;
`;

const StyledSliderLabel = styled.label`
  font-size: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  width: 50%;
  max-width: 100%;
  margin-left: 0.5rem;
  margin-top: 0.25rem;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: #424242;
    outline: none;
    height: 10px;
    border-radius: 10px;
    background-image: transparent;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -0.5em;
    appearance: none;
    height: 25px;
    width: 25px;
    background: #b8b8b8;
    border-radius: 100%;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;
export default SliderInput;
