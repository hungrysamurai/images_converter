import styled from "styled-components";

const StyledInnerShadow = styled.div.attrs<{
  $brVertical: string;
  $brHorizontal: string;
}>(({ $brVertical, $brHorizontal }) => ({
  $brVertical: $brVertical,
  $brHorizontal: $brHorizontal,
}))`
  position: fixed;
  width: var(--container-fit);
  height: var(--container-calc);
  background-color: transparent;
  border-radius: ${(props) => props.$brVertical};
  z-index: 2;
  pointer-events: none;
  box-shadow: var(--container-inner-shadow);

  @media (min-aspect-ratio: 1/1) {
    width: var(--container-calc);
    height: var(--container-fit);
    border-radius: ${(props) => props.$brHorizontal};
  }
`;

export default StyledInnerShadow;
