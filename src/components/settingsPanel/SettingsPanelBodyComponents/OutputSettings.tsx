import styled from "styled-components";
import React, { memo } from "react";

import {
  Lang,
  GIFDitherOptions,
  OutputFileFormatsNames,
  PDFCompressionTypes,
  ResizeUnits,
  SmoothingPresets,
} from "../../../types/types";

import { useAppSelector } from "../../../store/hooks";
import { getActiveFormatOutputSettings } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import CheckboxInput from "../InputComponents/CheckboxInput";
import SelectInput from "../InputComponents/SelectInput";
import NumberInput from "../InputComponents/NumberInput";
import SliderInput from "../InputComponents/SliderInput";

import {
  isDitherSetting,
  isCompressionSetting,
  isQualitySetting,
} from "../../../utils/typeGuards";

type OutputSettingsType = {
  lang: Lang;
  activeTargetFormatName: OutputFileFormatsNames;
};

const OutputSettings: React.FC<OutputSettingsType> = memo(
  function OutputSettings({ lang, activeTargetFormatName }) {
    const activeTargetFromatOutputSettings = useAppSelector(
      getActiveFormatOutputSettings
    );

    // Basic Options
    const { resize, units, targetHeight, targetWidth, smoothing } =
      activeTargetFromatOutputSettings;

    // Display quality slider
    const qualitySliderContent = isQualitySetting(
      activeTargetFromatOutputSettings
    ) ? (
      <>
        {/* JPEG / WEBP  quality slider */}
        {activeTargetFormatName === OutputFileFormatsNames.JPG ||
        activeTargetFormatName === OutputFileFormatsNames.WEBP ? (
          <SliderInput
            label={lang === Lang.EN ? "Quality:" : "Качество:"}
            currentValue={activeTargetFromatOutputSettings.quality}
            min="1"
            max="100"
            name="quality"
            mode={activeTargetFormatName}
          />
        ) : null}

        {/* GIF quality slider & dither options */}
        {isDitherSetting(activeTargetFromatOutputSettings) &&
        activeTargetFormatName === OutputFileFormatsNames.GIF ? (
          <>
            <SliderInput
              label={lang === Lang.EN ? "Quality:" : "Качество:"}
              currentValue={activeTargetFromatOutputSettings.quality}
              min="1"
              max="20"
              name="quality"
              mode={activeTargetFormatName}
            />
            <SelectInput
              options={Object.values(GIFDitherOptions)}
              label={lang === Lang.EN ? "Dither:" : "Дизеринг:"}
              name="dither"
              currentValue={
                activeTargetFromatOutputSettings.dither
                  ? activeTargetFromatOutputSettings.dither
                  : GIFDitherOptions.OFF
              }
              active={true}
            />
          </>
        ) : null}
      </>
    ) : null;

    const pdfCompressionSettingContent =
      isCompressionSetting(activeTargetFromatOutputSettings) &&
      activeTargetFormatName === OutputFileFormatsNames.PDF ? (
        <>
          <SelectInput
            options={Object.values(PDFCompressionTypes)}
            label={lang === Lang.EN ? "Compression:" : "Компрессия:"}
            name="compression"
            currentValue={
              activeTargetFromatOutputSettings.compression as PDFCompressionTypes
            }
            active={true}
          />

          {activeTargetFromatOutputSettings.compression ===
            PDFCompressionTypes.JPG && (
            <SliderInput
              label={lang === Lang.EN ? "Quality:" : "Качество:"}
              currentValue={activeTargetFromatOutputSettings.quality}
              min="1"
              max="100"
              name="quality"
              mode={activeTargetFormatName}
            />
          )}

          <CheckboxInput
            label={lang === Lang.EN ? "To one file:" : "В один файл"}
            currentValue={activeTargetFromatOutputSettings.merge}
            displayValueOn={lang === Lang.EN ? "On" : "Вкл"}
            displayValueOff={lang === Lang.EN ? "Off" : "Выкл"}
            name="merge"
          />
        </>
      ) : null;

    return (
      <StyledOutputSettingsContainer>
        <StyledOptionalSettingsContainer>
          {qualitySliderContent}
          {pdfCompressionSettingContent}
        </StyledOptionalSettingsContainer>

        <StyledDivider></StyledDivider>

        <StyledResizeSettingsContainer>
          <CheckboxInput
            label={lang === Lang.EN ? "Resize:" : "Изм. размер"}
            currentValue={resize}
            displayValueOn={lang === Lang.EN ? "On" : "Вкл"}
            displayValueOff={lang === Lang.EN ? "Off" : "Выкл"}
            name="resize"
          />
          <SelectInput
            options={[ResizeUnits.PERCENTAGES, ResizeUnits.PIXELS]}
            label={lang === Lang.EN ? "Units:" : "Ед. измерения:"}
            name="units"
            currentValue={units}
            active={resize}
          />

          <StyledResizeDimensionsContainer>
            <NumberInput
              caption={lang === Lang.EN ? "width" : "ширина"}
              units={units}
              active={resize}
              name="targetWidth"
              currentValue={targetWidth}
              min="1"
              max={units === "percentages" ? "1000" : "16384"}
            />
            <NumberInput
              caption={lang === Lang.EN ? "height" : "высота"}
              units={units}
              active={resize}
              name="targetHeight"
              currentValue={targetHeight}
              min="1"
              max={units === "percentages" ? "1000" : "16384"}
            />
          </StyledResizeDimensionsContainer>

          <SelectInput
            options={Object.values(SmoothingPresets)}
            label={
              lang === Lang.EN
                ? "Resize smoothing:"
                : "Сглаживание при масштабировании:"
            }
            name="smoothing"
            currentValue={smoothing ? smoothing : SmoothingPresets.OFF}
            active={resize}
          />
        </StyledResizeSettingsContainer>

        <StyledDivider></StyledDivider>
      </StyledOutputSettingsContainer>
    );
  }
);

const StyledOutputSettingsContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const StyledDivider = styled.div`
  width: 90%;
  height: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--element-light-gray);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.33) inset;
  margin: 1rem 0 1rem 0;

  @media (max-width: 768px) {
    margin: 0.25rem 0 0.25rem 0;
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
  margin: 1rem 1rem 2rem 1rem;
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

const StyledOptionalSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default OutputSettings;
