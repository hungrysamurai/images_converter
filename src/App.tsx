import { ScreenOrientations } from "./types/types";
import { useState } from "react";

import styled from "styled-components";

import GlobalStyles from "./GlobalStyles";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";
import DownloadPanel from "./components/DownloadPanel";
import SettingsPanelWrapper from "./components/settingsPanel/SettingsPanelWrapper";

import { getNavigatorLang } from "./lib/getNavigatorLang";

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
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-container-gray);

  @media (${ScreenOrientations.Vertical}) {
    flex-direction: column;
  }

  @media (${ScreenOrientations.Horizontal}) {
    flex-direction: row;
  }
`;

export default App;
