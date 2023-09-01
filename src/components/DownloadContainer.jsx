import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import {
  getActiveTargetFormat,
  switchTargetFormat,
} from "../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import { getAllProcessedFiles } from "../store/slices/processFilesSlice/processFilesSlice";

import FilesList from "./filesList/FilesList";

import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation } from "../animations";

const DownloadContainer = () => {
  const activeTargetFormatName = useSelector(getActiveTargetFormat);
  const allProccecedFiles = useSelector(getAllProcessedFiles);

  const dispatch = useDispatch();

  return (
    <StyledDownloadContainer>
      <AnimatePresence>
        {allProccecedFiles.length === 0 ? (
          <span
            className="placeholder"
            onClick={() => dispatch(switchTargetFormat())}
          >
            {activeTargetFormatName.toUpperCase()}
          </span>
        ) : (
          <StyledProcessedFilesListWrapper
            variants={fadeAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            key="processed-files-list"
          >
            <FilesList files={allProccecedFiles} />
          </StyledProcessedFilesListWrapper>
        )}
      </AnimatePresence>
    </StyledDownloadContainer>
  );
};

const StyledDownloadContainer = styled.div`
  width: 95%;
  height: calc((100% - 11rem) / 2);
  background-color: var(--bg-light-gray);
  border-radius: 0rem 0rem 2.5rem 2.5rem;
  box-shadow: var(--container-inner-shadow);
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6rem;
    font-weight: 700;
    color: var(--text-medium-gray);
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    height: calc((100% - 8rem) / 2);

    .placeholder {
      font-size: 3.5rem;
    }
  }
`;

const StyledProcessedFilesListWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
`;

export default DownloadContainer;
