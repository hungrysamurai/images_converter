import PropTypes from "prop-types";

import styled from "styled-components";

import { motion, AnimatePresence } from "framer-motion";
import { fadeAnimation, settingsPanelAnimation } from "../../animations";

import { useSelector } from "react-redux";

import { checkPDFInSourceFiles } from "../../store/slices/sourceFilesSlice/sourceFilesSlice";
import {
  getAllTargetFormats,
  getActiveTargetFormat,
} from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import IconCloseSettingsPanel from "../icons/IconCloseSettingsPanel";

import SettingsPanelBody from "./SettingsPanelBody";

const SettingsPanelWrapper = ({
  setSettingsPanelVisibility,
  settingsPanelVisibility,
  lang,
}) => {
  const isPDF = useSelector(checkPDFInSourceFiles);
  const formats = useSelector(getAllTargetFormats);
  const activeTargetFormatName = useSelector(getActiveTargetFormat);

  return (
    <AnimatePresence>
      {settingsPanelVisibility && (
        <>
          <StyledSettingsPanelBackground
            key="bg"
            variants={fadeAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
          />

          <StyledSettingsPanel
            key="panel"
            variants={settingsPanelAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <StyledCloseSettingsPanelHeader>
              <StyledCloseSettingsPanelButton
                onClick={() => setSettingsPanelVisibility(false)}
              >
                <IconCloseSettingsPanel />
              </StyledCloseSettingsPanelButton>
              {lang === "en" ? <h1>Output settings</h1> : <h1>Настройки</h1>}
            </StyledCloseSettingsPanelHeader>

            <SettingsPanelBody
              lang={lang}
              isPDF={isPDF}
              formats={formats}
              activeTargetFormatName={activeTargetFormatName}
            />
          </StyledSettingsPanel>
        </>
      )}
    </AnimatePresence>
  );
};

SettingsPanelWrapper.propTypes = {
  setSettingsPanelVisibility: PropTypes.func,
  settingsPanelVisibility: PropTypes.bool,
  lang: PropTypes.string,
};

const StyledSettingsPanelBackground = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(4px);
  opacity: 1;
  z-index: 2;
`;

const StyledSettingsPanel = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e3e3e3b6;
  backdrop-filter: blur(48px);
  width: 75vw;
  height: 100vh;
  border-radius: 2.5rem 0 0 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  z-index: 3;
  box-shadow: var(--container-shadow);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 500px) {
    width: 100vw;
    overflow-y: scroll;
  }
`;

const StyledCloseSettingsPanelHeader = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 500px) {
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const StyledCloseSettingsPanelButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 768px) {
    top: 0;
    svg {
      width: 1.5rem;
    }
  }
`;

export default SettingsPanelWrapper;
