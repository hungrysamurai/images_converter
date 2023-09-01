import styled from "styled-components";

import NumberInput from "./InputComponents/NumberInput";

import { getPDFInputSettings } from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import { useSelector } from "react-redux";

const InputSettings = () => {
  const PDFInputSettings = useSelector(getPDFInputSettings);
  const { resolution, rotation } = PDFInputSettings;

  return (
    <StyledInputSettingsContainer>
      <h2>PDF rasterization settings</h2>
      <StyledPDFRasterizationSettingsContainer>
        <NumberInput
          caption="resolution"
          units="ppi"
          active={true}
          name="resolution"
          currentValue={resolution}
          min="8"
          max="1200"
          inputSetting={true}
        />
        <NumberInput
          caption="rotation"
          units="deg"
          active={true}
          name="rotation"
          currentValue={rotation}
          min="0"
          max="360"
          inputSetting={true}
        />
      </StyledPDFRasterizationSettingsContainer>
    </StyledInputSettingsContainer>
  );
};

const StyledInputSettingsContainer = styled.div`
  width: 100%;
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  h2 {
    text-align: center;
  }
`;

const StyledPDFRasterizationSettingsContainer = styled.div`
  margin: 2rem 1rem 2rem 1rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 500px) {
    width: 100%;
    justify-content: space-around;
  }
`;

export default InputSettings;