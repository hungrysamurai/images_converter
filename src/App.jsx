import { useState } from "react";

import styled from "styled-components";

import GlobalStyles from "./GlobalStyles";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";
import DownloadPanel from "./components/DownloadPanel";
import SettingsPanel from "./components/settingsPanel/SettingsPanel";

function App() {
  const [settingsPanelVisibility, setSettingsPanelVisibility] = useState(false);

  return (
    <>
      <GlobalStyles />

      <SettingsPanel
        settingsPanelVisibility={settingsPanelVisibility}
        setSettingsPanelVisibility={setSettingsPanelVisibility}
      />

      <StyledMainContainer>

        <UploadContainer />
        <ActionsPanel setSettingsPanelVisibility={setSettingsPanelVisibility} />
        <DownloadContainer />
        <DownloadPanel />
        
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
