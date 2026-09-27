import styled from 'styled-components';

export const StyledDivider = styled.div`
  width: 90%;
  height: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--element-light-gray);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.33) inset;
  margin: 2rem 0 2rem 0;

  @media screen and (max-width: 768px), screen and (max-height: 500px) {
    margin: 1rem 0;
  }
`;
