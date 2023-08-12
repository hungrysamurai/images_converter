import styled from "styled-components";

import IconPlay from "./icons/IconPlay";
import IconSettings from "./icons/IconSettings";

const ActionsPanel = () => {
  return (
    <StyledActionPanel>
      <StyledActionButton>
        <IconSettings />
      </StyledActionButton>
      <StyledActionButton>
        <IconPlay />
      </StyledActionButton>
    </StyledActionPanel>
  );
};

const StyledActionPanel = styled.div`
  width: 95%;
  height: 8vh;
  background-color: var(--bg-container-gray);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledActionButton = styled.button`
  background: none;
  border: none;
  margin: 0 0.75rem;
  cursor: pointer;

  svg {
    width: 3rem;
  }

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 500px) {
    margin: 0 1rem;
    svg {
      width: 1.5rem;
    }
  }
`;

export default ActionsPanel;
