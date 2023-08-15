import styled from "styled-components";
import { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllSourceFiles,
  readSourceFileData,
} from "../store/slices/sourceFilesSlice/sourceFilesSlice";

import { checkFileType } from "../utils/checkFileType";

import FilesList from "./filesList/FilesList";
import { isHEIC } from "../utils/isHEIC";

const UploadContainer = () => {
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
      {sourceFiles.length !== 0 && (
          <StyledFilesListWrapper 
          ref={filesListWrapperRef}>

          <FilesList 
          files={sourceFiles}/>
          
          </StyledFilesListWrapper>
      )}

      <StyledImagesUploadForm 
      id="form-file-upload"
      >
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
              Drop your images here or <span className="upload-click">click</span>
              <br/>
              <span className="formats">
              (JPEG, PNG, GIF, WEBP, BMP, TIFF, PDF, HEIC)
              </span>
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

    h3{
      text-align: center;
      line-height: 100%;
      .upload-click {
          text-decoration: underline;
          cursor: pointer;
        }

      .formats{
        color: var(--text-medium-gray);
        font-size: 1rem;
      }
    }
    
  }
`;

const StyledFilesListWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
`;

export default UploadContainer;
