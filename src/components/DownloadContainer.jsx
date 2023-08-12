import styled from "styled-components";

const DownloadContainer = () => {
  return (
    <StyledDownloadContainer>
      <h2 className="placeholder">JPEG</h2>
    </StyledDownloadContainer>
  );
};

const StyledDownloadContainer = styled.div`
  width: 95%;
  height: 42vh;
  background-color: var(--bg-light-gray);
  border-radius: 0rem 0rem 2.5rem 2.5rem;
  box-shadow: var(--container-inner-shadow);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 6rem;
    color: var(--text-medium-gray);
  }

  @media (max-width: 500px) {
    .placeholder {
      font-size: 3.5rem;
    }
  }
`;

export default DownloadContainer;
