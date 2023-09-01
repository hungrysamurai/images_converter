import PropTypes from "prop-types";

import styled from "styled-components";

import FileElement from "./FileElement";

import { getFileFormat } from "../../utils/helpers/getFileFormat";
import { getFileSize } from "../../utils/helpers/getFileSize";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

const FilesList = memo(function FilesList({ files }) {
  return (
    <StyledFilesList layout layoutRoot>
      <AnimatePresence>
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
      </AnimatePresence>
    </StyledFilesList>
  );
});

FilesList.propTypes = {
  files: PropTypes.array,
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
