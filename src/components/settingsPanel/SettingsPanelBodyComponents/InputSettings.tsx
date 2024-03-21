import styled from "styled-components";
import { memo } from "react";

import { Lang, ResizeUnits } from "../../../types/types";

import { getPDFInputSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";
import { useAppSelector } from "../../../store/hooks";

import NumberInput from "../InputComponents/NumberInput";

type InputSettingsProps = {
  lang: Lang;
};

const InputSettings: React.FC<InputSettingsProps> = memo(
  function InputSettings({ lang }) {
    const PDFInputSettings = useAppSelector(getPDFInputSettings);

    const { resolution, rotation } = PDFInputSettings;

    return (
      <StyledInputSettingsContainer>
        {lang === Lang.EN ? (
          <h2>PDF rasterization settings</h2>
        ) : (
          <h2>Настройки растрирования PDF</h2>
        )}
        <StyledPDFRasterizationSettingsContainer>
          <NumberInput
            caption={lang === Lang.EN ? "resolution" : "разрешение"}
            units={ResizeUnits.PPI}
            active={true}
            name="resolution"
            currentValue={resolution}
            min="8"
            max="1200"
            inputSetting={true}
          />
          <NumberInput
            caption={lang === Lang.EN ? "rotation" : "поворот"}
            units={ResizeUnits.DEG}
            active={true}
            name="rotation"
            currentValue={rotation}
            min="0"
            max="360"
            inputSetting={true}
            step="90"
          />
        </StyledPDFRasterizationSettingsContainer>
      </StyledInputSettingsContainer>
    );
  }
);

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
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 500px) {
    width: 100%;
    justify-content: space-around;
  }
`;

export default InputSettings;
