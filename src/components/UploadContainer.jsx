import styled from "styled-components";
import { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllSourceFiles,
  readSourceFileData,
} from "../store/slices/sourceFilesSlice/sourceFilesSlice";

import { checkFileType } from "../utils/helpers/checkFileType";

import FilesList from "./filesList/FilesList";
import { isHEIC } from "../utils/helpers/isHEIC";

import { fadeAnimation } from "../animations";
import { AnimatePresence, motion } from "framer-motion";

import IconUpload from "./icons/IconUpload";

const UploadContainer = ({ lang }) => {
  const sourceFiles = useSelector(getAllSourceFiles);
  const dispatch = useDispatch();

  const inputLabelRef = useRef(null);
  const filesListWrapperRef = useRef(null);

  // drag state
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    if (e.dataTransfer.files.length !== 0) {
      handleFiles([...e.dataTransfer.files]);
    }
  };

  // triggers when file is selected with click
  const handleClick = function (e) {
    e.preventDefault();
    if (e.target.files.length !== 0) {
      handleFiles([...e.target.files]);
    }
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (checkFileType(files[i].type) || isHEIC(files[i])) {
        dispatch(readSourceFileData(files[i]));
      }
    }
  };

  const handleContainerClick = (e) => {
    if (filesListWrapperRef.current === e.target.parentElement) {
      inputLabelRef.current.click();
    }
  };

  return (
    <StyledUploadContainer
      onDragEnter={handleDrag}
      onClick={handleContainerClick}
    >
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
              {lang === "en" ? (
                <>
                  Drop your images here or{" "}
                  <span className="upload-click">click</span>
                  <br />
                </>
              ) : (
                <>
                  Ператащите файл в эту область или{" "}
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
  width: 95%;
  height: calc((100% - 11rem) / 2);
  background-color: var(--bg-light-gray);
  border-radius: 2.5rem 2.5rem 0rem 0rem;
  box-shadow: var(--container-inner-shadow);
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    height: calc((100% - 8rem) / 2);
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
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default UploadContainer;
