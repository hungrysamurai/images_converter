import { useState, useRef, DragEvent, ChangeEvent, MouseEvent } from "react";

import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import { Lang, MIMETypes } from "../types/types";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addSourceFile,
  getAllSourceFiles,
} from "../store/slices/sourceFilesSlice/sourceFilesSlice";

import IconUpload from "./icons/IconUpload";
import FilesList from "./filesList/FilesList";
import StyledInnerShadow from "./StyledInnerShadow";

import { fadeAnimation } from "../animations";

import { isHEIC } from "../lib/helpers/isHEIC";
import { checkFileType } from "../lib/helpers/checkFileType";

type UploadContainerProps = {
  lang: Lang;
};

const UploadContainer: React.FC<UploadContainerProps> = ({ lang }) => {
  const sourceFiles = useAppSelector(getAllSourceFiles);
  const dispatch = useAppDispatch();

  const inputLabelRef = useRef<HTMLLabelElement>(null);
  const filesListWrapperRef = useRef<HTMLDivElement>(null);

  // drag state
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    if (e.dataTransfer.files.length !== 0) {
      handleFiles([...e.dataTransfer.files]);
    }
  };

  // triggers when file is selected with click
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length !== 0) {
      handleFiles([...e.target.files]);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (isHEIC(file)) {
        const heicFile = new File([file], file.name, {
          type: MIMETypes.HEIC,
        });
        dispatch(addSourceFile(heicFile));
      } else if (checkFileType(file.type)) {
        dispatch(addSourceFile(file));
      }
    });
  };

  // handle click on upload container when some files already uploaded
  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (
      filesListWrapperRef.current ===
      (e.target as HTMLFormElement).parentElement
    ) {
      if (inputLabelRef.current) {
        inputLabelRef.current.click();
      }
    }
  };

  return (
    <StyledUploadContainer
      onDragEnter={handleDrag}
      onClick={handleContainerClick}
    >
      <StyledInnerShadow
        $brHorizontal={`var(--round-corner) 0rem 0rem var(--round-corner)`}
        $brVertical={`var(--round-corner) var(--round-corner) 0rem 0rem`}
      />
      <AnimatePresence>
        {sourceFiles.length !== 0 && (
          <StyledUploadedFilesListWrapper
            variants={fadeAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            ref={filesListWrapperRef}
            key="uploaded-files-list"
          >
            <FilesList files={sourceFiles} />
          </StyledUploadedFilesListWrapper>
        )}
      </AnimatePresence>

      <StyledImagesUploadForm id="form-file-upload">
        <input
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleClick}
          hidden
        />

        <label
          htmlFor="input-file-upload"
          className={`file-upload-label ${
            sourceFiles.length !== 0 ? "files-added" : ""
          }`}
          ref={inputLabelRef}
        >
          <div>
            <h3>
              {lang === Lang.EN ? (
                <>
                  Drop your images here or{" "}
                  <span className="upload-click">click</span>
                  <br />
                </>
              ) : (
                <>
                  Перетащите файл в эту область или{" "}
                  <span className="upload-click">нажмите</span>
                  <br />
                </>
              )}
              <span className="formats">
                (JPEG, PNG, GIF, WEBP, BMP, TIFF, PDF, HEIC)
              </span>
            </h3>
          </div>
        </label>
      </StyledImagesUploadForm>

      <AnimatePresence>
        {dragActive && (
          <StyledDragPlaceholder
            variants={fadeAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <IconUpload />
          </StyledDragPlaceholder>
        )}
      </AnimatePresence>
    </StyledUploadContainer>
  );
};

const StyledUploadContainer = styled.div`
  position: relative;
  width: var(--container-fit);
  height: var(--container-calc);
  background-color: var(--bg-light-gray);
  border-radius: var(--round-corner) var(--round-corner) 0rem 0rem;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-aspect-ratio: 1/1) {
    width: var(--container-calc);
    height: var(--container-fit);
    border-radius: var(--round-corner) 0rem 0rem var(--round-corner);
  }
`;

const StyledImagesUploadForm = styled.form`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;

  .file-upload-label {
    &.files-added {
      visibility: hidden;
    }

    h3 {
      padding: 1rem;
      text-align: center;
      line-height: 100%;
      .upload-click {
        text-decoration: underline;
        cursor: pointer;
      }

      .formats {
        display: block;
        margin-top: 0.5rem;
        color: var(--text-medium-gray);
        font-size: 1rem;
      }
    }
  }
`;

const StyledUploadedFilesListWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
`;

const StyledDragPlaceholder = styled(motion.div)`
  position: fixed;
  width: var(--container-fit);
  height: var(--container-calc);
  z-index: 2;
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--round-corner) var(--round-corner) 0rem 0rem;

  @media (min-aspect-ratio: 1/1) {
    width: var(--container-calc);
    height: var(--container-fit);
    border-radius: var(--round-corner) 0rem 0rem var(--round-corner);
  }
`;

export default UploadContainer;
