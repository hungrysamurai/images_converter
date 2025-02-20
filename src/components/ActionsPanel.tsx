import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import IconPlay from "./icons/IconPlay";
import IconSettings from "./icons/IconSettings";
import IconLoadingSpinner from "./icons/IconLoadingSpinner";

import {
  convertFiles,
  isProcessingLoading,
} from "../store/slices/processFilesSlice/processFilesSlice";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ScreenOrientations } from "../types/types";

type ActionsPanelProps = {
  setSettingsPanelVisibility: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  setSettingsPanelVisibility,
}) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isProcessingLoading);

  return (
    <StyledActionPanel>
      <StyledActionButton
        className={isLoading ? "disabled" : ""}
        onClick={
          isLoading ? () => null : () => setSettingsPanelVisibility(true)
        }
      >
        <IconSettings />
      </StyledActionButton>

      <AnimatePresence>
        {isLoading ? (
          <StyledActionButton className="disabled">
            <IconLoadingSpinner />
          </StyledActionButton>
        ) : (
          <StyledActionButton onClick={() => dispatch(convertFiles())}>
            <IconPlay />
          </StyledActionButton>
        )}
      </AnimatePresence>
    </StyledActionPanel>
  );
};

const StyledActionPanel = styled.div`
  width: var(--full);
  height: var(--panel-thickness);
  background-color: var(--bg-container-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  @media (${ScreenOrientations.Horizontal}) {
    flex-direction: column;
    width: var(--panel-thickness);
    height: var(--full);
  }
`;

const StyledActionButton = styled(motion.div)`
  background: none;
  border: none;
  cursor: pointer;
  width: 3rem;
  padding: 0.25rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    cursor: default;
    filter: brightness(1.2);

    &:hover {
      filter: brightness(1.2);
    }
  }

  &:hover {
    filter: brightness(0.9);
  }

  @media (${ScreenOrientations.Horizontal}) {
    width: 100%;
    height: 3rem;
  }
`;

export default ActionsPanel;
