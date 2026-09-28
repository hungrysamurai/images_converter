import { memo } from 'react';

import { Lang } from '@/types/types';
import { type OutputFormat } from '@/types/formats';

import FormatSelect from './SettingsPanelBodyComponents/FormatSelect';
import OutputSettings from './SettingsPanelBodyComponents/OutputSettings';
import { StyledDivider } from './SettingsPanelBodyComponents/StyledDivider';
import InputSettings from './SettingsPanelBodyComponents/InputSettings';

type SettingsPanelBodyProps = {
  isPDF: boolean;
  lang: Lang;
  activeTargetFormatName: OutputFormat;
};

const SettingsPanelBody: React.FC<SettingsPanelBodyProps> = memo(function SettingsPanelBody({
  isPDF,
  lang,
  activeTargetFormatName,
}) {
  return (
    <>
      <FormatSelect lang={lang} activeTargetFormatName={activeTargetFormatName} />

      <OutputSettings lang={lang} activeTargetFormatName={activeTargetFormatName} />

      {isPDF && (
        <>
          <InputSettings lang={lang} />
          <StyledDivider />
        </>
      )}
    </>
  );
});

export default SettingsPanelBody;
