import styled from "styled-components";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { addSourceFile } from "../store/slices/sourceFilesSlice/sourceFilesSlice";

import { checkFileType } from "../utils/checkFileType";

const UploadContainer = () => {
  // const rawImages = useSelector((state) => state.rawImages.rawFiles);
  const dispatch = useDispatch();

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
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files.length !== 0) {
      handleFiles([...e.target.files]);
    }
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (checkFileType(files[i].type)) {
        dispatch(addSourceFile(files[i]));
      }
    }
    // revokeObjectUrl
  };

  return (
    <StyledUploadContainer>
      <StyledImagesUploadArea
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
          hidden
        />

        <label
          id="file-upload-label"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <h3>Drop your images here or click</h3>
          </div>
        </label>

        {dragActive && (
          <div
            className="drag-placeholder"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </StyledImagesUploadArea>
    </StyledUploadContainer>
  );
};

const StyledUploadContainer = styled.div``;

const StyledImagesUploadArea = styled.form`
  height: 50%;
  width: 100%;
  text-align: center;
  position: relative;
  padding: 0.5rem;
  overflow: hidden;

  #file-upload-label {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-radius: 1rem;
    border-style: dashed;
    border-color: #cbd5e1;
    background-color: #f8fafc;

    .upload-button {
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1rem;
      border: none;
      background-color: transparent;
      font-family: inherit;

      &:hover {
        text-decoration-line: underline;
      }
    }

    &.drag-active {
      background-color: #ffffff;
    }
  }

  .drag-placeholder {
    position: absolute;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    border-radius: 1rem;
    background-color: var(--color-primary);
    top: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
  }
`;

export default UploadContainer;
