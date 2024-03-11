import styled from "styled-components";

import { motion } from "framer-motion";
import { fileElementAnimation } from "../../animations";

import IconRemoveElement from "../icons/IconRemoveElement";
import IconDownloadElement from "../icons/IconDownloadElement";

import { useAppDispatch } from "../../store/hooks";

import { removeSourceFile } from "../../store/slices/sourceFilesSlice/sourceFilesSlice";
import { removeConvertedFile } from "../../store/slices/processFilesSlice/processFilesSlice";

import { memo } from "react";
import { FileFormatsNames } from "../../types";

type FileElementProps = {
  id: string;
  format: FileFormatsNames;
  size: string;
  name: string;
  downloadLink?: string;
};

export enum ElementColorMode {
  Light = "light",
  Dark = "dark",
}

const elementsColor = {
  pdf: ElementColorMode.Dark,
  bmp: ElementColorMode.Dark,
  jpeg: ElementColorMode.Light,
  png: ElementColorMode.Light,
  gif: ElementColorMode.Light,
  webp: ElementColorMode.Light,
  tiff: ElementColorMode.Light,
  heic: ElementColorMode.Light,
};

const FileElement: React.FC<FileElementProps> = memo(
  ({ id, format, size, name, downloadLink }) => {
    console.log(format);

    const dispatch = useAppDispatch();

    const removeElement = (id: string) => {
      if (downloadLink) {
        dispatch(removeConvertedFile(id));
      } else {
        dispatch(removeSourceFile(id));
      }
    };

    const trimName = name.length > 14 ? name.slice(0, 14) + "..." : name;

    return (
      <StyledFileElement
        variants={fileElementAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
        layout
        $bg={format}
        $color={elementsColor[format]}
      >
        <StyledRemoveElementButton onClick={() => removeElement(id)}>
          <IconRemoveElement bg={elementsColor[format]} />
        </StyledRemoveElementButton>

        {downloadLink && (
          <StyledDownloadElementLink href={downloadLink} download={name}>
            <IconDownloadElement bg={elementsColor[format]} />
          </StyledDownloadElementLink>
        )}

        <div className="file-name">{`${trimName}`}</div>
        <div className="file-size">{size}</div>

        <div className="format-caption">{format.toUpperCase()}</div>
      </StyledFileElement>
    );
  }
);

const StyledFileElement = styled(motion.div).attrs<{
  $bg: FileFormatsNames;
  $color: ElementColorMode;
}>(({ $bg, $color }) => ({
  $bg: $bg,
  $color: $color,
}))`
  width: 6rem;
  height: 6rem;
  padding: 0.125rem;
  position: relative;
  background-color: var(--format-color-${(props) => props.$bg});
  border-radius: 1rem;
  box-shadow: var(--image-element-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Ubuntu Condensed", sans-serif;
  cursor: pointer;

  .file-name {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 0.75rem;
  }

  .file-size {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 1rem;
    margin-top: 0.25rem;
  }

  .format-caption {
    position: absolute;
    bottom: 0.5rem;
    right: 50%;
    transform: translateX(50%);
    font-family: "Ubuntu Mono", monospace;
    font-weight: 700;
    font-size: 0.75rem;
    color: var(--text-${(props) => props.$color}-gray);
  }

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    padding: 0.1rem;
    border-radius: 0.75rem;

    .file-name {
      font-size: 0.5rem;
    }

    .file-size {
      color: var(--text-${(props) => props.$color}-gray);
      font-size: 0.75rem;
      margin-top: 0.1rem;
    }
  }
`;

const StyledRemoveElementButton = styled.button`
  position: absolute;
  top: 0.33rem;
  right: 0.33rem;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: 768px) {
    top: 0.25rem;
    right: 0.25rem;

    svg {
      width: 0.9rem;
      height: 0.9rem;
    }
  }
`;

const StyledDownloadElementLink = styled.a`
  position: absolute;
  top: 0.33rem;
  left: 0.66rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: 768px) {
    top: 0.2rem;
    left: 0.35rem;

    svg {
      width: 0.9rem;
      height: 0.9rem;
    }
  }
`;

export default FileElement;
