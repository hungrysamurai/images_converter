import styled from "styled-components";

import GlobalStyles from "./GlobalStyles";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";

function App() {
  return (
    <>
      <GlobalStyles />

      <StyledMainContainer>
        <UploadContainer />
        <ActionsPanel />
        <DownloadContainer />
      </StyledMainContainer>
    </>
  );
}

const StyledMainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-container-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default App;
