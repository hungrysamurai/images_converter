import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import styled from 'styled-components';

import { memo, useState, type ButtonHTMLAttributes, type Ref } from 'react';

import { ElementColorMode, Lang } from '@/types/types';
import { isPreviewFormat, type InputFormat } from '@/types/formats';

import {
  dragHandleAnimation,
  fileElementAnimation,
  fileInfoContainerAnimation,
  filePreviewIconAnimation,
} from '@/animations';

import { useAppDispatch } from '@/store/hooks';
import { removeConvertedFile } from '@/store/slices/processFilesSlice/processFilesSlice';
import { removeSourceFile } from '@/store/slices/sourceFilesSlice/sourceFilesSlice';

import IconDownloadElement from '../icons/IconDownloadElement';
import IconDragHandle from '../icons/IconDragHandle';
import IconPreviewFile from '../icons/IconPreviewFile';
import IconRemoveElement from '../icons/IconRemoveElement';

export type DragHandleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref: Ref<HTMLButtonElement>;
};

export type FileElementProps = {
  id: string;
  format: InputFormat;
  size: string;
  name: string;
  downloadLink?: string;
  souceFileLink?: string;
  dragHandleProps?: DragHandleProps;
  isDragActive?: boolean;
  isOverlay?: boolean;
  lang?: Lang;
};

const elementsColor = {
  pdf: ElementColorMode.Dark,
  bmp: ElementColorMode.Dark,
  jpeg: ElementColorMode.Light,
  png: ElementColorMode.Light,
  gif: ElementColorMode.Light,
  webp: ElementColorMode.Light,
  tiff: ElementColorMode.Light,
  heic: ElementColorMode.Light,
  svg: ElementColorMode.Light,
};

const FileElement: React.FC<FileElementProps> = memo(
  ({
    id,
    format,
    size,
    name,
    downloadLink,
    souceFileLink,
    dragHandleProps,
    isDragActive = false,
    isOverlay = false,
    lang = Lang.EN,
  }) => {
    const [previewBtn, setPreviewBtn] = useState(false);

    // reset hover preview when drag starts, so it doesn't stick after drop
    const [prevDragActive, setPrevDragActive] = useState(isDragActive);
    if (isDragActive !== prevDragActive) {
      setPrevDragActive(isDragActive);
      if (isDragActive) setPreviewBtn(false);
    }

    const dispatch = useAppDispatch();

    const removeElement = (id: string) => {
      if (downloadLink) {
        dispatch(removeConvertedFile(id));
      } else {
        dispatch(removeSourceFile(id));
      }
    };

    const trimName = name.length > 14 ? name.slice(0, 14) + '...' : name;

    return (
      <StyledFileElement
        variants={fileElementAnimation}
        initial={isOverlay ? false : 'hidden'}
        animate="show"
        exit="exit"
        layout={!isDragActive}
        $bg={format}
        $color={elementsColor[format]}
        onMouseEnter={() => {
          if (!isDragActive) setPreviewBtn(() => true);
        }}
        onMouseLeave={() => {
          setPreviewBtn(() => false);
        }}
      >
        <StyledRemoveElementButton onClick={() => removeElement(id)}>
          <IconRemoveElement bg={elementsColor[format]} />
        </StyledRemoveElementButton>

        <AnimatePresence initial={false}>
          {(dragHandleProps || isOverlay) && (
            <StyledDragHandle
              variants={dragHandleAnimation}
              initial={isOverlay ? false : 'hidden'}
              animate="show"
              exit="exit"
              key="drag-handle"
              $color={elementsColor[format]}
            >
              <button
                type="button"
                tabIndex={isOverlay ? -1 : undefined}
                aria-label={
                  lang === Lang.EN ? `Reorder file ${name}` : `Изменить порядок файла ${name}`
                }
                {...dragHandleProps}
              >
                <IconDragHandle bg={elementsColor[format]} />
              </button>
            </StyledDragHandle>
          )}
        </AnimatePresence>

        {downloadLink && (
          <StyledDownloadElementLink href={downloadLink} download={name}>
            <IconDownloadElement bg={elementsColor[format]} />
          </StyledDownloadElementLink>
        )}

        <AnimatePresence initial={false}>
          {previewBtn && isPreviewFormat(format) && (downloadLink || souceFileLink) ? (
            <StyledFilePreview
              variants={filePreviewIconAnimation}
              initial="hidden"
              animate="show"
              exit="exit"
              key="file-preview-icon"
            >
              <a href={downloadLink ? downloadLink : souceFileLink} target="_blank">
                <IconPreviewFile fillColor={elementsColor[format]} />
              </a>
            </StyledFilePreview>
          ) : (
            <StyledFileInfo
              variants={fileInfoContainerAnimation}
              initial="hidden"
              animate="show"
              exit="exit"
              $color={elementsColor[format]}
            >
              <div className="file-name">{`${trimName}`}</div>
              <div className="file-size">{size}</div>
            </StyledFileInfo>
          )}
        </AnimatePresence>

        <div className="format-caption">{format.toUpperCase()}</div>
      </StyledFileElement>
    );
  },
);

interface StyledFileElementProps extends HTMLMotionProps<'div'> {
  $bg: InputFormat;
  $color: ElementColorMode;
}

interface StyledFileInfoProps extends HTMLMotionProps<'div'> {
  $color: ElementColorMode;
}

const StyledFileElement = styled(motion.div).attrs<StyledFileElementProps>(({ $bg, $color }) => ({
  $bg: $bg,
  $color: $color,
}))<StyledFileElementProps>`
  width: 6rem;
  height: 6rem;
  padding: 0.125rem;
  position: relative;
  background-color: var(--format-color-${(props) => props.$bg});
  border-radius: 1rem;
  box-shadow: var(--image-element-shadow);
  overflow: hidden;

  font-family: 'Ubuntu Condensed', sans-serif;

  .format-caption {
    position: absolute;
    bottom: 0.5rem;
    right: 50%;
    transform: translateX(50%);
    font-family: 'Ubuntu Mono', monospace;
    font-weight: 700;
    font-size: 0.75rem;
    color: var(--text-${(props) => props.$color}-gray);
  }

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    padding: 0.1rem;
    border-radius: 0.75rem;
  }
`;

const StyledFileInfo = styled(motion.div).attrs<StyledFileInfoProps>(({ $color }) => ({
  $color: $color,
}))<StyledFileInfoProps>`
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .file-name {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 0.75rem;
  }

  .file-size {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 1rem;
    margin-top: 0.25rem;
  }

  @media (max-width: 768px) {
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

const StyledFilePreview = styled(motion.div)`
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    margin-top: 0.125rem;
  }

  @media (max-width: 768px) {
    svg {
      margin-top: 0.075rem;
      width: 1.5rem;
      height: 1.5rem;
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

const StyledDragHandle = styled(motion.div)<{ $color: ElementColorMode }>`
  position: absolute;
  top: 0.33rem;
  left: 0.66rem;
  display: flex;

  button {
    position: relative;
    display: flex;
    padding: 0;
    background: none;
    border: none;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    border-radius: 0.25rem;

    &:focus-visible {
      outline: 2px solid var(--icon-${(props) => props.$color}-gray);
      outline-offset: 1px;
    }
  }

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

    /* ~24px touch target around the 0.9rem icon; shifted down-right, because the card clips
       everything above and left of it */
    button::before {
      content: '';
      position: absolute;
      top: -0.2rem;
      left: -0.3rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

export default FileElement;
