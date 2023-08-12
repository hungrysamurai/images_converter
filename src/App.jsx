import GlobalStyles from "./GlobalStyles";

import UploadContainer from "./components/UploadContainer";
import ActionsPanel from "./components/ActionsPanel";
import DownloadContainer from "./components/DownloadContainer";

function App() {
  return (
    <>
      <GlobalStyles />

      <UploadContainer />
      <ActionsPanel />
      <DownloadContainer />
    </>
  );
}

export default App;
