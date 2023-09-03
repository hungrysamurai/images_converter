import styled from "styled-components";
import IconDownloadAll from "./icons/IconDownloadAll";
import IconRemoveAll from "./icons/IconRemoveAll";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllProcessedFiles,
  removeAllConvertedFiles,
  downloadAllFiles,
  isProcessingLoading,
} from "../store/slices/processFilesSlice/processFilesSlice";

const DownloadPanel = () => {
  const dispatch = useDispatch();

  const processedFiles = useSelector(getAllProcessedFiles);
  const isLoading = useSelector(isProcessingLoading);

  const downloadAllProcessedFiles = () => {
    dispatch(downloadAllFiles());
  };

  const removeAllProcessedFiles = () => {
    dispatch(removeAllConvertedFiles());
  };

  return (
    <StyledDownloadPanel>
      {processedFiles.length !== 0 && (
        <>
          <StyledDownloadButton
            className={isLoading ? "disabled" : ""}
            onClick={isLoading ? null : () => downloadAllProcessedFiles()}
          >
            <IconDownloadAll />
          </StyledDownloadButton>
          <StyledDownloadButton
            className={isLoading ? "disabled" : ""}
            onClick={isLoading ? null : () => removeAllProcessedFiles()}
          >
            <IconRemoveAll />
          </StyledDownloadButton>
        </>
      )}
    </StyledDownloadPanel>
  );
};

const StyledDownloadPanel = styled.div`
  width: 95%;
  height: 5rem;
  background-color: var(--bg-container-gray);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 3.5rem;
  }
`;

const StyledDownloadButton = styled.button`
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

export default DownloadPanel;
