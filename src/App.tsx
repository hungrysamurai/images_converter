import { useState } from "react";

import styled from "styled-components";

import GlobalStyles from "./GlobalStyles";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";
import DownloadPanel from "./components/DownloadPanel";
import SettingsPanelWrapper from "./components/settingsPanel/SettingsPanelWrapper";

import { getNavigatorLang } from "./utils/getNavigatorLang";

function App() {
  const [settingsPanelVisibility, setSettingsPanelVisibility] = useState(false);
  const [lang] = useState(() => getNavigatorLang());

  return (
    <>
      <GlobalStyles />

      <SettingsPanelWrapper
        settingsPanelVisibility={settingsPanelVisibility}
        setSettingsPanelVisibility={setSettingsPanelVisibility}
        lang={lang}
      />

      <StyledMainContainer>
        <UploadContainer lang={lang} />
        <ActionsPanel setSettingsPanelVisibility={setSettingsPanelVisibility} />
        <DownloadContainer lang={lang} />
        <DownloadPanel />
      </StyledMainContainer>
    </>
  );
}

const StyledMainContainer = styled.div`
  width: 100vw;
  height: 100dvh;
  background-color: var(--bg-container-gray);
  display: flex;
  margin-top: 0.25rem;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  @media (min-aspect-ratio: 1/1) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

export default App;
