import styled from "styled-components";

const textColor = {
  pdf: "dark",
  bmp: "dark",
  jpeg: "light",
  png: "light",
  gif: "light",
  webp: "light",
  tiff: "light",
};

const FileElement = ({ format, size, name }) => {
  const trimName = name.length > 7 ? name.slice(0, 7) + "..." : name;

  return (
    <StyledFileElement $bg={format} $color={textColor[format]}>
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
  }

  .file-size {
    color: var(--text-${(props) => props.$color}-gray);
    font-size: 1rem;
    margin-top: 0.25rem;
  }
`;
export default FileElement;
