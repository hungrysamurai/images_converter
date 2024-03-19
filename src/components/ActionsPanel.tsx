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
  width: 95%;
  height: 5rem;
  background-color: var(--bg-container-gray);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 3.5rem;
  }

  @media (min-aspect-ratio: 1/1) {
    flex-direction: column;
    width: 5rem;
    height: 100%;
    gap: 2rem;
  }
`;

const StyledActionButton = styled(motion.div)`
  background: none;
  border: none;
  margin: 0 0.75rem;
  cursor: pointer;

  &.disabled {
    cursor: default;
    filter: brightness(1.2);

    &:hover {
      filter: brightness(1.2);
    }
  }

  svg {
    width: 3rem;
  }

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 768px) {
    margin: 0 1rem;
    svg {
      width: 1.75rem;
    }
  }
`;

export default ActionsPanel;
