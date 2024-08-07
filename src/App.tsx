import { Ubuntu_Mono } from "next/font/google";

import { useState } from "react";

import styled from "styled-components";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";
import DownloadPanel from "./components/DownloadPanel";
import SettingsPanelWrapper from "./components/settingsPanel/SettingsPanelWrapper";

import { getNavigatorLang } from "./utils/getNavigatorLang";

import StoreProvider from "./StoreProvider";

const ubuntu = Ubuntu_Mono({ weight: "400", subsets: ["latin", "cyrillic"] });

function App() {
  const [settingsPanelVisibility, setSettingsPanelVisibility] = useState(false);
  const [lang] = useState(() => getNavigatorLang());

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${ubuntu.style.fontFamily};
        }
      `}</style>

      <StoreProvider>
        <SettingsPanelWrapper
          settingsPanelVisibility={settingsPanelVisibility}
          setSettingsPanelVisibility={setSettingsPanelVisibility}
          lang={lang}
        />

        <StyledMainContainer>
          <UploadContainer lang={lang} />
          <ActionsPanel
            setSettingsPanelVisibility={setSettingsPanelVisibility}
          />
          <DownloadContainer lang={lang} />
          <DownloadPanel />
        </StyledMainContainer>
      </StoreProvider>
    </>
  );
}

const StyledMainContainer = styled.div`
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
