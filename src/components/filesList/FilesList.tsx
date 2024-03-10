import styled from "styled-components";

import FileElement from "./FileElement";

import { getFileFormat } from "../../utils/helpers/getFileFormat";
import { getFileSize } from "../../utils/helpers/getFileSize";

import { AnimatePresence, motion } from "framer-motion";

// type guard
function isProcessedFile(
  toCheck: ProcessedFile | SourceFile
): toCheck is ProcessedFile {
  return (toCheck as ProcessedFile).downloadLink !== undefined;
}

type FilesListProps = {
  files: ProcessedFile[] | SourceFile[];
};

const FilesList: React.FC<FilesListProps> = ({ files }) => {
  return (
    <StyledFilesList layout layoutRoot>
      <AnimatePresence>
        {files.map((file) => {
          return (
            <FileElement
              key={file.id}
              id={file.id}
              format={getFileFormat(file.type)}
              name={file.name}
              size={getFileSize(file.size)}
              downloadLink={
                isProcessedFile(file) ? file.downloadLink : undefined
              }
            />
          );
        })}
      </AnimatePresence>
    </StyledFilesList>
  );
};

const StyledFilesList = styled(motion.div)`
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

  @media (max-width: 768px) {
    padding: 1rem;
    grid-template-columns: repeat(auto-fit, 4rem);
    grid-auto-rows: 4rem;
    gap: 0.5rem;
  }
`;

export default FilesList;
