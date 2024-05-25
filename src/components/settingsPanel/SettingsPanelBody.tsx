import { memo } from "react";

import { Lang } from "../../types/types";
import { OutputFileFormatsNames } from "../../types/types";

import FormatSelect from "./SettingsPanelBodyComponents/FormatSelect";
import OutputSettings, {
  StyledDivider,
} from "./SettingsPanelBodyComponents/OutputSettings";
import InputSettings from "./SettingsPanelBodyComponents/InputSettings";

type SettingsPanelBodyProps = {
  isPDF: boolean;
  lang: Lang;
  formats: OutputFileFormatsNames[];
  activeTargetFormatName: OutputFileFormatsNames;
};

const SettingsPanelBody: React.FC<SettingsPanelBodyProps> = memo(
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

        {isPDF && (
          <>
            <InputSettings lang={lang} />
            <StyledDivider />
          </>
        )}
      </>
    );
  }
);

export default SettingsPanelBody;
