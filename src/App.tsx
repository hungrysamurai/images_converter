import { useState } from "react";

import styled from "styled-components";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";
import DownloadPanel from "./components/DownloadPanel";
import SettingsPanelWrapper from "./components/settingsPanel/SettingsPanelWrapper";

import { getNavigatorLang } from "./lib/getNavigatorLang";

import StoreProvider from "./StoreProvider";

function App() {
  const [settingsPanelVisibility, setSettingsPanelVisibility] = useState(false);
  const [lang] = useState(() => getNavigatorLang());

  return (
    <StoreProvider>
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
    </StoreProvider>
  );
}

const StyledMainContainer = styled.main`
  width: 100vw;
  height: 100dvh;
  margin-top: 0.25rem;
  background-color: var(--bg-container-gray);
  display: flex;

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
