import styled from "styled-components";
import { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllSourceFiles,
  readSourceFilesData,
} from "../store/slices/sourceFilesSlice/sourceFilesSlice";

import { checkFileType } from "../utils/checkFileType";
import { getFileFormat } from "../utils/getFileFormat";
import { getFileSize } from "../utils/getFileSize";

import FileElement from "./filesList/FileElement";
import FilesList from "./filesList/FilesList";

import { trimFileName } from "../utils/trimFileName";

const UploadContainer = () => {
  const sourceFiles = useSelector(getAllSourceFiles);
  const dispatch = useDispatch();

  const inputLabelRef = useRef(null);
  const sourceFilesListBackground = useRef(null);

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
      if (checkFileType(files[i].type)) {
        dispatch(readSourceFilesData(files[i]));
      }
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
    if (sourceFilesListBackground.current === e.target) {
      inputLabelRef.current.click();
    }
  };

  return (
    <StyledUploadContainer
      onDragEnter={handleDrag}
      onClick={handleContainerClick}
    >
      {sourceFiles.length !== 0 && (
       <FilesList files={sourceFiles}/>
      )}

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
              Drop your images here or <span>click</span>
            </h3>
          </div>
        </label>
      </StyledImagesUploadForm>

      {dragActive && (
        <div
          className="drag-placeholder"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </StyledUploadContainer>
  );
};

const StyledUploadContainer = styled.div`
  position: relative;
  margin-top: 4vh;
  width: 95%;
  height: 40vh;
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

  .drag-placeholder {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: var(--text-dark-gray);
    z-index: 2;
  }
`;

const StyledSourceFilesList = styled.div`
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

    span {
      text-decoration: underline;
    }
  }
`;

export default UploadContainer;
