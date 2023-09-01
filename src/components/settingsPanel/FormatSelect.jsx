import PropTypes from "prop-types";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import {
  selectTargetFormat,
  getActiveTargetFormat,
} from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

const FormatSelect = ({ formats, lang }) => {
  const dispatch = useDispatch();
  const activeTargetFormatName = useSelector(getActiveTargetFormat);

  return (
    <StyledFormatSelect>
      <StyledLabel>
        {lang === "en" ? "Target format:" : "Конвертировать в:"}
        <StyledSelect
          onChange={(e) => {
            dispatch(selectTargetFormat(e.target.value));
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
};

FormatSelect.propTypes = {
  formats: PropTypes.array,
  lang: PropTypes.string,
};

const StyledFormatSelect = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const StyledLabel = styled.label`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 12rem;
  max-width: 80%;
  height: 3rem;
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  background: var(--bg-light-gray);
  cursor: pointer;

  @media (max-width: 768px) {
    height: 2rem;
    width: 6rem;
    font-size: 1rem;
    padding: 0.1rem;
  }
`;

export default FormatSelect;
