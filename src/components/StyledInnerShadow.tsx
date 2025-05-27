import styled from 'styled-components';
import { ScreenOrientations } from '../types/types';

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
  z-index: 3;
  pointer-events: none;
  box-shadow: var(--container-inner-shadow);

  @media (${ScreenOrientations.Horizontal}) {
    width: var(--container-calc);
    height: var(--container-fit);
    border-radius: ${(props) => props.$brHorizontal};
  }
`;

export default StyledInnerShadow;
