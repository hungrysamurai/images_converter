import styled from "styled-components";
import { memo } from "react";

import { Lang, OutputFileFormatsNames } from "../../../types/types";

import { useAppDispatch } from "../../../store/hooks";
import { selectTargetFormat } from "../../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

type FormatSelectProps = {
  formats: OutputFileFormatsNames[];
  lang: Lang;
  activeTargetFormatName: OutputFileFormatsNames;
};

const FormatSelect: React.FC<FormatSelectProps> = memo(function FormatSelect({
  formats,
  lang,
  activeTargetFormatName,
}) {
  const dispatch = useAppDispatch();

  return (
    <StyledFormatSelect>
      <StyledLabel>
        {lang === "en" ? "Target format:" : "Конвертировать в:"}
        <StyledSelect
          onChange={(e) => {
            dispatch(
              selectTargetFormat(e.target.value as OutputFileFormatsNames)
            );
          }}
          defaultValue={activeTargetFormatName}
        >
          {formats.map((formatName, i) => (
            <option key={i} value={formatName}>
              {formatName.toUpperCase()}
            </option>
          ))}
        </StyledSelect>
      </StyledLabel>
    </StyledFormatSelect>
  );
});

const StyledFormatSelect = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    margin-top: 1rem;
  }
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  height: 3rem;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    font-size: 1rem;
  }
`;

const StyledSelect = styled.select`
  width: 7rem;
  height: 3rem;
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-dark-gray);
  background: var(--bg-light-gray);
  cursor: pointer;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    height: 2.5rem;
    width: 5rem;
    font-size: 1rem;
  }
`;

export default FormatSelect;
