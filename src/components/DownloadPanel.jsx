import styled from 'styled-components';
import IconDownloadAll from './icons/IconDownloadAll';
import IconRemoveAll from './icons/IconRemoveAll';

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { getAllProcessedFiles } from '../store/slices/processFilesSlice/processFilesSlice';

const DownloadPanel = () => {
 const processedFiles = useSelector(getAllProcessedFiles);

 const downloadAllProcessedFiles = () => {
  console.log('download all...');
 }

 const removeAllProcessedFiles = () => {
  console.log('remove all...');
 }

 if(processedFiles.length !== 0){
  return (
    <StyledDownloadPanel>
       <StyledDownloadButton 
       onClick={downloadAllProcessedFiles}>
           <IconDownloadAll/>
       </StyledDownloadButton>
       <StyledDownloadButton 
       onClick={removeAllProcessedFiles}>
           <IconRemoveAll/>
       </StyledDownloadButton>
    </StyledDownloadPanel>
  )
 }
}

const StyledDownloadPanel = styled.div`
  width: 95%;
  height: 8vh;
  background-color: var(--bg-container-gray);
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledDownloadButton = styled.button`
  background: none;
  border: none;
  margin: 0 0.75rem;
  cursor: pointer;

  svg {
    width: 3rem;
  }

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 500px) {
    margin: 0 1rem;
    svg {
      width: 1.5rem;
    }
  }
`;

export default DownloadPanel