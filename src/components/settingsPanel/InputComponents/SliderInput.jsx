import styled from "styled-components";
import { useState } from "react";

const SliderInput = () => {
  const [sliderValue, setSliderValue] = useState(75);

  const handleChange = (e) => {
    console.log(e.target.value);
    setSliderValue(e.target.value);
  };

  return (
    <StyledSliderContainer>
      <StyledSliderLabel>
        Quality:
        <StyledSliderInput
          type="range"
          min="1"
          max="100"
          onChange={handleChange}
          value={sliderValue}
        />
      </StyledSliderLabel>

      <StyledSliderDisplayValue>
        {sliderValue}
      </StyledSliderDisplayValue>

    </StyledSliderContainer>
  );
};

const StyledSliderContainer = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
`;

const StyledSliderLabel = styled.label`
  font-size: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSliderInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  width: 70%;
  max-width: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0.25rem;
  cursor: pointer;

  &:focus{
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: var(--element-light-gray);
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.33) inset;;
    outline: none;
    height: 1rem;
    border-radius: 1rem;
    background-image: transparent;
  }

  &::-moz-range-track{
    width: 100%;
    height: 1rem;
    background: var(--element-light-gray);
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.33) inset;
    border-radius: 1rem;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -0.125rem;
    height: 1.25rem;
    width: 1.25rem;
    background: var(--element-light-gray);
    border-radius: 100%;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
    border: none;
    cursor: pointer;
    transition: 0.4s;

    &:hover{
      background: var(--element-dark-gray);
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb{
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 100%;
    border: none;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
    background: var(--element-light-gray);
    transition: 0.4s;

    &:hover{
        background: var(--element-dark-gray);
        transform: scale(1.2);
    }
  }
`;

const StyledSliderDisplayValue = styled.div`
width:15%;
display: flex;
align-items: center;
justify-content: flex-start;
font-size: 2rem;

 @media (max-width: 500px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`
export default SliderInput;
