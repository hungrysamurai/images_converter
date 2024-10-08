import styled from "styled-components";
import { motion } from "framer-motion";

import FileElement from "./FileElement";

import { getFileFormat } from "../../lib/helpers/getFileFormat";
import { getFileSize } from "../../lib/helpers/getFileSize";
import { isProcessedFile } from "../../lib/typeGuards";
import { memo } from "react";

type FilesListProps = {
  files: ProcessedFile[] | SourceFile[];
};

const FilesList: React.FC<FilesListProps> = memo(({ files }) => {
  return (
    <StyledFilesList layout layoutRoot>
      {files.map((file) => {
        return (
          <FileElement
            key={file.id}
            id={file.id}
            format={getFileFormat(file.type)}
            name={file.name}
            size={getFileSize(file.size)}
            downloadLink={isProcessedFile(file) ? file.downloadLink : undefined}
          />
        );
      })}
    </StyledFilesList>
  );
});

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
