import FormatSelect from "./SettingsPanelBodyComponents/FormatSelect";
import OutputSettings from "./SettingsPanelBodyComponents/OutputSettings";
import InputSettings from "./SettingsPanelBodyComponents/InputSettings";

import { memo } from "react";
import { Lang } from "../../types";

type SettingsPanelBodyType = {
  isPDF: boolean;
  lang: Lang;
  formats: OutputFileFormatsNames[];
  activeTargetFormatName: OutputFileFormatsNames;
};

const SettingsPanelBody: React.FC<SettingsPanelBodyType> = memo(
  function SettingsPanelBody({ isPDF, lang, formats, activeTargetFormatName }) {
    return (
      <>
        <FormatSelect
          formats={formats}
          lang={lang}
          activeTargetFormatName={activeTargetFormatName}
        />

        <OutputSettings
          lang={lang}
          activeTargetFormatName={activeTargetFormatName}
        />

        {isPDF && <InputSettings lang={lang} />}
      </>
    );
  }
);

export default SettingsPanelBody;
