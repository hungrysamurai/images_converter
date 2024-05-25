import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { MutableRefObject, useRef } from "react";

import { Lang } from "../../types/types";

import { fadeAnimation, settingsPanelAnimation } from "../../animations";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { checkPDFInSourceFiles } from "../../store/slices/sourceFilesSlice/sourceFilesSlice";
import {
  getAllTargetFormats,
  getActiveTargetFormatName,
  defaultActiveTargetFormat,
} from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import IconCloseSettingsPanel from "../icons/IconCloseSettingsPanel";
import SettingsPanelBody from "./SettingsPanelBody";
import useOutsideClick from "../../hooks/useOutsideClick";
import { StyledDivider } from "./SettingsPanelBodyComponents/OutputSettings";

type SettingsPanelWrapperType = {
  setSettingsPanelVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  settingsPanelVisibility: boolean;
  lang: Lang;
};

const SettingsPanelWrapper: React.FC<SettingsPanelWrapperType> = ({
  setSettingsPanelVisibility,
  settingsPanelVisibility,
  lang,
}) => {
  const isPDF = useAppSelector(checkPDFInSourceFiles);
  const formats = useAppSelector(getAllTargetFormats);
  const activeTargetFormatName = useAppSelector(getActiveTargetFormatName);

  const dispatch = useAppDispatch();

  const panelRef = useRef<HTMLDivElement>(null);

  useOutsideClick(panelRef as MutableRefObject<HTMLDivElement>, () => {
    setSettingsPanelVisibility(() => false);
  });

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
            ref={panelRef}
          >
            <StyledCloseSettingsPanelHeader>
              <StyledCloseSettingsPanelButton
                onClick={() => setSettingsPanelVisibility(false)}
              >
                <IconCloseSettingsPanel />
              </StyledCloseSettingsPanelButton>
              {lang === Lang.EN ? <h1>Output settings</h1> : <h1>Настройки</h1>}
            </StyledCloseSettingsPanelHeader>

            <SettingsPanelBody
              lang={lang}
              isPDF={isPDF}
              formats={formats}
              activeTargetFormatName={activeTargetFormatName}
            />

            <StyledDefaultButton
              onClick={() => dispatch(defaultActiveTargetFormat())}
            >
              {lang === Lang.EN ? "Default Settings" : "Сбросить настройки"}
            </StyledDefaultButton>
          </StyledSettingsPanel>
        </>
      )}
    </AnimatePresence>
  );
};

const StyledDefaultButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-dark-gray);
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;
  background-color: var(--bg-container-gray);
  cursor: pointer;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.11);

  &:hover {
    background-color: var(--bg-light-gray);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StyledSettingsPanelBackground = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  opacity: 1;
  z-index: 2;
`;

const StyledSettingsPanel = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e3e3e3c3;
  backdrop-filter: blur(36px);
  width: 30rem;
  height: 100dvh;
  border-radius: var(--round-corner) 0 0 var(--round-corner);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  z-index: 3;
  box-shadow: var(--container-shadow);
  overflow: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.35rem;
    height: 0.35rem;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--element-dark-gray);
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--element-light-gray);
  }

  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const StyledCloseSettingsPanelHeader = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
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

  svg {
    width: 3rem;
  }
`;

export default SettingsPanelWrapper;
