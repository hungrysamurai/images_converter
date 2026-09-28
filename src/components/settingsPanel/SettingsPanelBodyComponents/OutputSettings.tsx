import React, { memo } from 'react';
import styled from 'styled-components';

import {
  GIFDitherOptions,
  Lang,
  PDFCompressionTypes,
  SmoothingPresets,
  Units,
} from '@/types/types';
import { type OutputFormat } from '@/types/formats';

import { useAppSelector } from '@/store/hooks';
import { getActiveFormatOutputSettings } from '@/store/slices/conversionSettingsSlice/conversionSettingsSlice';

import CheckboxInput from '../InputComponents/CheckboxInput';
import NumberInput from '../InputComponents/NumberInput';
import SelectInput from '../InputComponents/SelectInput';
import SliderInput from '../InputComponents/SliderInput';
import { StyledDivider } from './StyledDivider';

import { isCompressionSetting, isDitherSetting, isQualitySetting } from '@/types/typeGuards';

type OutputSettingsType = {
  lang: Lang;
  activeTargetFormatName: OutputFormat;
};

const OutputSettings: React.FC<OutputSettingsType> = memo(function OutputSettings({
  lang,
  activeTargetFormatName,
}) {
  // Current format settings
  const activeTargetFromatOutputSettings = useAppSelector(getActiveFormatOutputSettings);

  // Basic options
  const { resize, units, targetHeight, targetWidth, smoothing } = activeTargetFromatOutputSettings;

  // Format specific options
  const JPEG_WEBP_QualitySlider =
    isQualitySetting(activeTargetFromatOutputSettings) &&
    (activeTargetFormatName === 'jpeg' || activeTargetFormatName === 'webp') ? (
      <SliderInput
        label={lang === Lang.EN ? 'Quality:' : 'Качество:'}
        currentValue={activeTargetFromatOutputSettings.quality}
        min="1"
        max="100"
        name="quality"
        mode={activeTargetFormatName}
      />
    ) : null;

  const GIFSettings =
    isDitherSetting(activeTargetFromatOutputSettings) && activeTargetFormatName === 'gif' ? (
      <>
        <SliderInput
          label={lang === Lang.EN ? 'Quality:' : 'Качество:'}
          currentValue={activeTargetFromatOutputSettings.quality}
          min="1"
          max="20"
          name="quality"
          mode={activeTargetFormatName}
        />
        <SelectInput
          options={Object.values(GIFDitherOptions)}
          label={lang === Lang.EN ? 'Dither:' : 'Дизеринг:'}
          name="dither"
          currentValue={
            activeTargetFromatOutputSettings.dither
              ? activeTargetFromatOutputSettings.dither
              : GIFDitherOptions.OFF
          }
          active={true}
        />
        <CheckboxInput
          label={lang === Lang.EN ? 'To one file:' : 'В один файл'}
          currentValue={activeTargetFromatOutputSettings.merge}
          displayValueOn={lang === Lang.EN ? 'On' : 'Вкл'}
          displayValueOff={lang === Lang.EN ? 'Off' : 'Выкл'}
          name="merge"
        />

        {activeTargetFromatOutputSettings.merge && (
          <NumberInput
            caption={lang === Lang.EN ? 'delay' : 'кадр'}
            units={Units.MS}
            active={true}
            name="animationDelay"
            currentValue={activeTargetFromatOutputSettings.animationDelay}
            min="1"
            max="10000"
          />
        )}
      </>
    ) : null;

  const PDFCompressionSettings =
    isCompressionSetting(activeTargetFromatOutputSettings) && activeTargetFormatName === 'pdf' ? (
      <>
        <SelectInput
          options={Object.values(PDFCompressionTypes)}
          label={lang === Lang.EN ? 'Compression:' : 'Компрессия:'}
          name="compression"
          currentValue={activeTargetFromatOutputSettings.compression}
          active={true}
        />

        {activeTargetFromatOutputSettings.compression === PDFCompressionTypes.JPG && (
          <SliderInput
            label={lang === Lang.EN ? 'Quality:' : 'Качество:'}
            currentValue={activeTargetFromatOutputSettings.quality}
            min="1"
            max="100"
            name="quality"
            mode={activeTargetFormatName}
          />
        )}

        <CheckboxInput
          label={lang === Lang.EN ? 'To one file:' : 'В один файл'}
          currentValue={activeTargetFromatOutputSettings.merge}
          displayValueOn={lang === Lang.EN ? 'On' : 'Вкл'}
          displayValueOff={lang === Lang.EN ? 'Off' : 'Выкл'}
          name="merge"
        />
      </>
    ) : null;

  return (
    <StyledOutputSettingsContainer>
      <StyledOptionalSettingsContainer>
        {JPEG_WEBP_QualitySlider}
        {GIFSettings}
        {PDFCompressionSettings}
      </StyledOptionalSettingsContainer>

      <StyledDivider />

      <StyledResizeSettingsContainer>
        <CheckboxInput
          label={lang === Lang.EN ? 'Resize:' : 'Изм. размер'}
          currentValue={resize}
          displayValueOn={lang === Lang.EN ? 'On' : 'Вкл'}
          displayValueOff={lang === Lang.EN ? 'Off' : 'Выкл'}
          name="resize"
        />
        <SelectInput
          options={[Units.PERCENTAGES, Units.PIXELS]}
          label={lang === Lang.EN ? 'Units:' : 'Ед. измерения:'}
          name="units"
          currentValue={units}
          active={resize}
        />

        <StyledResizeDimensionsContainer>
          <NumberInput
            caption={lang === Lang.EN ? 'width' : 'ширина'}
            units={units}
            active={resize}
            name="targetWidth"
            currentValue={targetWidth}
            min="1"
            max={units === 'percentages' ? '1000' : '16384'}
          />
          <NumberInput
            caption={lang === Lang.EN ? 'height' : 'высота'}
            units={units}
            active={resize}
            name="targetHeight"
            currentValue={targetHeight}
            min="1"
            max={units === 'percentages' ? '1000' : '16384'}
          />
        </StyledResizeDimensionsContainer>

        <SelectInput
          options={Object.values(SmoothingPresets)}
          label={lang === Lang.EN ? 'Resize smoothing:' : 'Сглаживание при масштабировании:'}
          name="smoothing"
          currentValue={smoothing ? smoothing : SmoothingPresets.OFF}
          active={resize}
        />
      </StyledResizeSettingsContainer>

      <StyledDivider />
    </StyledOutputSettingsContainer>
  );
});

const StyledOutputSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 1rem;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    margin-top: 0.5rem;
  }
`;

const StyledResizeSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledResizeDimensionsContainer = styled.div`
  margin: 0.5rem;
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

const StyledOptionalSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default OutputSettings;
