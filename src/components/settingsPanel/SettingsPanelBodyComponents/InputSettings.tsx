import styled from 'styled-components';
import { memo } from 'react';

import { Lang, Units } from '../../../types/types';

import { getPDFInputSettings } from '../../../store/slices/conversionSettingsSlice/conversionSettingsSlice';
import { useAppSelector } from '../../../store/hooks';

import NumberInput from '../InputComponents/NumberInput';

type InputSettingsProps = {
  lang: Lang;
};

const InputSettings: React.FC<InputSettingsProps> = memo(function InputSettings({ lang }) {
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
          caption={lang === Lang.EN ? 'resolution' : 'разрешение'}
          units={Units.PPI}
          active={true}
          name="resolution"
          currentValue={resolution}
          min="8"
          max="1200"
          inputSetting={true}
        />
        <NumberInput
          caption={lang === Lang.EN ? 'rotation' : 'поворот'}
          units={Units.DEG}
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
});

const StyledInputSettingsContainer = styled.div`
  width: 100%;
  margin: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  h2 {
    text-align: center;
    font-size: 1.5rem;
  }
`;

const StyledPDFRasterizationSettingsContainer = styled.div`
  margin-top: 2rem;
  height: 3rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
`;

export default InputSettings;
