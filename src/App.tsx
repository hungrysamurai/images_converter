import { useState } from 'react';
import { ScreenOrientations } from './types/types';

import styled from 'styled-components';

import GlobalStyles from './GlobalStyles';

import ActionsPanel from './components/ActionsPanel';
import DownloadContainer from './components/DownloadContainer';
import DownloadPanel from './components/DownloadPanel';
import SettingsPanelWrapper from './components/settingsPanel/SettingsPanelWrapper';
import UploadContainer from './components/UploadContainer';

import { getNavigatorLang } from './lib/utils/getNavigatorLang';

import { MetrikaCounter } from 'react-metrika';

const App = () => {
  const [settingsPanelVisibility, setSettingsPanelVisibility] = useState(false);
  const [lang] = useState(() => getNavigatorLang());

  return (
    <>
      {import.meta.env.VITE_TARGET_DOMAIN === 'convert-it.ru' && (
        <MetrikaCounter
          id={import.meta.env.VITE_YANDEX_METRICA_COUNTER_CONVERT_IT_RU}
          options={{
            trackHash: true,
            webvisor: true,
          }}
        />
      )}

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
      {import.meta.env.VITE_TARGET_DOMAIN && (
        <StyledFooter>
          Автор -{' '}
          <a href="https://hungrysamurai.ru" target="blank">
            hungrysamurai
          </a>
        </StyledFooter>
      )}
    </>
  );
};

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

const StyledFooter = styled.footer`
  position: absolute;
  z-index: 1;

  left: 0.1rem;
  font-size: 0.75rem;
  color: var(--text-medium-gray);

  a {
    color: var(--text-medium-gray);
  }

  @media (${ScreenOrientations.Vertical}) {
    bottom: 0.75rem;
  }

  @media (${ScreenOrientations.Horizontal}) {
    bottom: 0.1rem;
  }
`;

export default App;
