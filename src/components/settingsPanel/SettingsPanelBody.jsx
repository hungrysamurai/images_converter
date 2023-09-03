import PropTypes from "prop-types";

import FormatSelect from "./SettingsPanelBodyComponents/FormatSelect";
import OutputSettings from "./SettingsPanelBodyComponents/OutputSettings";
import InputSettings from "./SettingsPanelBodyComponents/InputSettings";

import { memo } from "react";

const SettingsPanelBody = memo(function SettingsPanelBody({
  isPDF,
  lang,
  formats,
  activeTargetFormatName,
}) {
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
});

SettingsPanelBody.propTypes = {
  lang: PropTypes.string,
  activeTargetFormatName: PropTypes.string,
  isPDF: PropTypes.bool,
  formats: PropTypes.array,
};

export default SettingsPanelBody;
