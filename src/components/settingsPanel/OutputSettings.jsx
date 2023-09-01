import styled from "styled-components";

import { useSelector } from "react-redux";

import {
  getActiveTargetFormat,
  getActiveFormatOutputSettings,
} from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import CheckboxInput from "./InputComponents/CheckboxInput";
import SelectInput from "./InputComponents/SelectInput";
import NumberInput from "./InputComponents/NumberInput";
import SliderInput from "./InputComponents/SliderInput";

import {
  GIFDitherOptions,
  PDFCompressionOptions,
  resizeUnits,
  resizeSmoothingOptions,
} from "../../store/slices/conversionSettingsSlice/settings";

const OutputSettings = () => {
  const activeTargetFormatName = useSelector(getActiveTargetFormat);
  const activeTargetFromatOutputSettings = useSelector(
    getActiveFormatOutputSettings
  );

  const {
    resize,
    units,
    targetHeight,
    targetWidth,
    smoothing,
    quality,
    dither,
    compression,
  } = activeTargetFromatOutputSettings;

  return (
    <StyledOutputSettingsContainer>
      <StyledOptionalSettingsContainer>
        {activeTargetFormatName === "jpeg" ||
        activeTargetFormatName === "webp" ? (
          <SliderInput
            label="Quality:"
            currentValue={quality}
            min="1"
            max="100"
            name="quality"
            mode={activeTargetFormatName}
          />
        ) : null}

        {activeTargetFormatName === "gif" && (
          <>
            <SliderInput
              label="Quality:"
              currentValue={quality}
              min="1"
              max="20"
              name="quality"
              mode={activeTargetFormatName}
            />
            <SelectInput
              options={GIFDitherOptions}
              label="Dither:"
              name="dither"
              currentValue={dither}
              active={true}
            />
          </>
        )}

        {activeTargetFormatName === "pdf" && (
          <SelectInput
            options={PDFCompressionOptions}
            label="Compression:"
            name="compression"
            currentValue={compression}
            active={true}
          />
        )}
      </StyledOptionalSettingsContainer>

      <StyledDivider></StyledDivider>

      <StyledResizeSettingsContainer>
        <CheckboxInput currentValue={resize} />
        <SelectInput
          options={resizeUnits}
          label="Units:"
          name="units"
          currentValue={units}
          active={resize}
        />

        <StyledResizeDimensionsContainer>
          <NumberInput
            caption="width"
            units={units}
            active={resize}
            name="targetWidth"
            currentValue={targetWidth}
            min="1"
            max={units === "percentages" ? 1000 : 16384}
          />
          <NumberInput
            caption="height"
            units={units}
            active={resize}
            name="targetHeight"
            currentValue={targetHeight}
            min="1"
            max={units === "percentages" ? 1000 : 16384}
          />
        </StyledResizeDimensionsContainer>

        <SelectInput
          options={resizeSmoothingOptions}
          label={"Resize smoothing:"}
          name="smoothing"
          currentValue={smoothing}
          active={resize}
        />
      </StyledResizeSettingsContainer>

      <StyledDivider></StyledDivider>
    </StyledOutputSettingsContainer>
  );
};

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
