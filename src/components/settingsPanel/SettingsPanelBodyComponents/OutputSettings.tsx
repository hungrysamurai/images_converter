import React from 'react';
import styled from 'styled-components';

import { Lang } from '@/types/types';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  getActiveOutputTarget,
  setAnimationDelay,
  setCompression,
  setDither,
  setMerge,
  setQuality,
  setResize,
  setResizeUnits,
  setSmoothing,
  setTargetHeight,
  setTargetWidth,
} from '@/store/slices/conversionSettingsSlice/conversionSettingsSlice';
import {
  DITHER_OPTIONS,
  PDF_COMPRESSION_OPTIONS,
  RESIZE_UNITS,
  SMOOTHING_OPTIONS,
  type OutputTarget,
} from '@/store/slices/conversionSettingsSlice/types';

import CheckboxInput from '../InputComponents/CheckboxInput';
import NumberInput from '../InputComponents/NumberInput';
import SelectInput from '../InputComponents/SelectInput';
import SliderInput from '../InputComponents/SliderInput';
import { StyledDivider } from './StyledDivider';

type OutputSettingsType = {
  lang: Lang;
};

type FormatSettingsProps = {
  lang: Lang;
  target: OutputTarget;
};

const FormatSettings: React.FC<FormatSettingsProps> = ({ lang, target }) => {
  const dispatch = useAppDispatch();

  const qualityLabel = lang === Lang.EN ? 'Quality:' : 'Качество:';

  const mergeCheckbox = (merge: boolean) => (
    <CheckboxInput
      label={lang === Lang.EN ? 'To one file:' : 'В один файл'}
      value={merge}
      displayValueOn={lang === Lang.EN ? 'On' : 'Вкл'}
      displayValueOff={lang === Lang.EN ? 'Off' : 'Выкл'}
      onChange={(value) => dispatch(setMerge(value))}
    />
  );

  switch (target.format) {
    case 'jpeg':
    case 'webp':
      return (
        <SliderInput
          label={qualityLabel}
          value={target.settings.quality}
          min={1}
          max={100}
          onChange={(value) => dispatch(setQuality(value))}
        />
      );

    case 'gif': {
      const { quality, dither, merge, animationDelay } = target.settings;

      return (
        <>
          <SliderInput
            label={qualityLabel}
            value={quality}
            min={1}
            max={20}
            onChange={(value) => dispatch(setQuality(value))}
          />
          <SelectInput
            options={DITHER_OPTIONS}
            label={lang === Lang.EN ? 'Dither:' : 'Дизеринг:'}
            value={dither}
            active={true}
            onChange={(value) => dispatch(setDither(value))}
          />
          {mergeCheckbox(merge)}

          {merge && (
            <NumberInput
              caption={lang === Lang.EN ? 'delay' : 'кадр'}
              suffix="ms"
              active={true}
              value={animationDelay}
              min={1}
              max={10000}
              onChange={(value) => dispatch(setAnimationDelay(value))}
            />
          )}
        </>
      );
    }

    case 'pdf': {
      const { compression, quality, merge } = target.settings;

      return (
        <>
          <SelectInput
            options={PDF_COMPRESSION_OPTIONS}
            label={lang === Lang.EN ? 'Compression:' : 'Компрессия:'}
            value={compression}
            active={true}
            onChange={(value) => dispatch(setCompression(value))}
          />

          {compression === 'jpeg' && (
            <SliderInput
              label={qualityLabel}
              value={quality}
              min={1}
              max={100}
              onChange={(value) => dispatch(setQuality(value))}
            />
          )}

          {mergeCheckbox(merge)}
        </>
      );
    }

    case 'png':
    case 'bmp':
    case 'tiff':
      return null;
  }
};

const OutputSettings: React.FC<OutputSettingsType> = ({ lang }) => {
  const dispatch = useAppDispatch();
  const target = useAppSelector(getActiveOutputTarget);

  const { resize, units, targetHeight, targetWidth, smoothing } = target.settings;

  const dimensionSuffix = units === 'pixels' ? 'px' : '%';
  const dimensionMax = units === 'percentages' ? 1000 : 16384;

  return (
    <StyledOutputSettingsContainer>
      <StyledOptionalSettingsContainer>
        <FormatSettings lang={lang} target={target} />
      </StyledOptionalSettingsContainer>

      <StyledDivider />

      <StyledResizeSettingsContainer>
        <CheckboxInput
          label={lang === Lang.EN ? 'Resize:' : 'Изм. размер'}
          value={resize}
          displayValueOn={lang === Lang.EN ? 'On' : 'Вкл'}
          displayValueOff={lang === Lang.EN ? 'Off' : 'Выкл'}
          onChange={(value) => dispatch(setResize(value))}
        />
        <SelectInput
          options={RESIZE_UNITS}
          label={lang === Lang.EN ? 'Units:' : 'Ед. измерения:'}
          value={units}
          active={resize}
          onChange={(value) => dispatch(setResizeUnits(value))}
        />

        <StyledResizeDimensionsContainer>
          <NumberInput
            caption={lang === Lang.EN ? 'width' : 'ширина'}
            suffix={dimensionSuffix}
            active={resize}
            value={targetWidth}
            min={1}
            max={dimensionMax}
            onChange={(value) => dispatch(setTargetWidth(value))}
          />
          <NumberInput
            caption={lang === Lang.EN ? 'height' : 'высота'}
            suffix={dimensionSuffix}
            active={resize}
            value={targetHeight}
            min={1}
            max={dimensionMax}
            onChange={(value) => dispatch(setTargetHeight(value))}
          />
        </StyledResizeDimensionsContainer>

        <SelectInput
          options={SMOOTHING_OPTIONS}
          label={lang === Lang.EN ? 'Resize smoothing:' : 'Сглаживание при масштабировании:'}
          value={smoothing}
          active={resize}
          onChange={(value) => dispatch(setSmoothing(value))}
        />
      </StyledResizeSettingsContainer>

      <StyledDivider />
    </StyledOutputSettingsContainer>
  );
};

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
