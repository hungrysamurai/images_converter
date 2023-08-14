import styled from "styled-components";

import IconRemoveElement from "./icons/IconRemoveElement";

import useListenWindowWidth from "../hooks/useListenWindowWidth";

import { useDispatch } from "react-redux";

import { removeSourceFile } from "../store/slices/sourceFilesSlice/sourceFilesSlice";

const elementsColor = {
  pdf: "dark",
  bmp: "dark",
  jpeg: "light",
  png: "light",
  gif: "light",
  webp: "light",
  tiff: "light",
};

const FileElement = ({ id, format, size, name }) => {
  const dispatch = useDispatch();
  const currentWindowWidth = useListenWindowWidth();

  const removeElement = (id) => {
   dispatch(removeSourceFile(id))
  }
  
  const trimName = name.length > 7 ? name.slice(0, 7) + "..." : name;

  return (
    <StyledFileElement $bg={format} $color={elementsColor[format]}>

      <StyledRemoveElementButton
      onClick={() => removeElement(id)}
      >
        <IconRemoveElement bg={elementsColor[format]}/>
      </StyledRemoveElementButton>

      <div className="file-name">{`${trimName}.${format}`}</div>
      <div className="file-size">{size}</div>
    </StyledFileElement>
  );
};

const StyledFileElement = styled.div.attrs((props) => ({
  $bg: props.$bg,
  $color: props.$color,
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
  cursor: pointer;

  .file-name {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .file-size {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 1rem;
    margin-top: 0.25rem;
  }
`;

const StyledRemoveElementButton = styled.button`
 position: absolute;
 top: 0.33rem;
 right:0.33rem;
 background: none;
 border: none;
 cursor: pointer;
`;

export default FileElement;
