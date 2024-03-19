import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation } from "../animations";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getActiveTargetFormatName,
  switchTargetFormat,
} from "../store/slices/conversionSettingsSlice/conversionSettingsSlice";
import { getAllProcessedFiles } from "../store/slices/processFilesSlice/processFilesSlice";

import FilesList from "./filesList/FilesList";
import { Lang } from "../types/types";

type DownloadContainerProps = {
  lang: Lang;
};

const DownloadContainer: React.FC<DownloadContainerProps> = ({ lang }) => {
  const activeTargetFormatName = useAppSelector(getActiveTargetFormatName);
  const allProccecedFiles = useAppSelector(getAllProcessedFiles);

  const dispatch = useAppDispatch();

  return (
    <StyledDownloadContainer>
      <AnimatePresence>
        {allProccecedFiles.length === 0 ? (
          <>
            <div
              className="placeholder"
              onClick={() => dispatch(switchTargetFormat())}
            >
              <span className="output-caption">
                {lang === "en" ? "Output format:" : "Конвертировать в:"}
              </span>
              <span className="output-format">
                {activeTargetFormatName.toUpperCase()}
              </span>
            </div>
          </>
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
  border-radius: 0rem 0rem var(--round-corner) var(--round-corner);
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-medium-gray);
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;

    .output-caption {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .output-format {
      font-size: 6rem;
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    height: calc((100% - 8rem) / 2);

    .placeholder {
      .output-caption {
        font-size: 1rem;
      }
      .output-format {
        font-size: 3.5rem;
        font-weight: 700;
      }
    }
  }

  @media (min-aspect-ratio: 1/1) {
    width: calc((100% - 11rem) / 2);
    height: 95%;
    border-radius: 0rem var(--round-corner) var(--round-corner) 0rem;
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
