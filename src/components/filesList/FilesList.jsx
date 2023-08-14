import styled from 'styled-components';

import FileElement from './FileElement';

import { getFileFormat } from '../../utils/getFileFormat';
import { trimFileName } from '../../utils/trimFileName';
import { getFileSize } from '../../utils/getFileSize';

const FilesList = ({ files }) => {

  return (
    <StyledFilesList>
      {files.map(({ id, type, name, size, downloadLink }) => (
          <FileElement
            key={id}
            id={id}
            format={getFileFormat(type)}
            name={name}
            size={getFileSize(size)}
            downloadLink={downloadLink ? downloadLink : null}
          />
          ))}
    </StyledFilesList>
  )
}

const StyledFilesList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, 6rem);
  grid-auto-rows: 6rem;
  align-items: start;
  justify-content: center;
  gap: 1rem;
  z-index: 1;
`;

export default FilesList