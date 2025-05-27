import styled from 'styled-components';
import IconDownloadAll from './icons/IconDownloadAll';
import IconRemoveAll from './icons/IconRemoveAll';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getAllProcessedFiles,
  removeAllConvertedFiles,
  downloadAllFiles,
  isProcessingLoading,
} from '../store/slices/processFilesSlice/processFilesSlice';
import { ScreenOrientations } from '../types/types';

const DownloadPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const processedFiles = useAppSelector(getAllProcessedFiles);
  const isLoading = useAppSelector(isProcessingLoading);

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
            className={isLoading ? 'disabled' : ''}
            onClick={isLoading ? () => null : () => downloadAllProcessedFiles()}
          >
            <IconDownloadAll />
          </StyledDownloadButton>
          <StyledDownloadButton
            className={isLoading ? 'disabled' : ''}
            onClick={isLoading ? () => null : () => removeAllProcessedFiles()}
          >
            <IconRemoveAll />
          </StyledDownloadButton>
        </>
      )}
    </StyledDownloadPanel>
  );
};

const StyledDownloadPanel = styled.div`
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

const StyledDownloadButton = styled.button`
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

export default DownloadPanel;
