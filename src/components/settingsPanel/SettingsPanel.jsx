import styled from "styled-components";

import { motion, AnimatePresence } from "framer-motion";
import { fadeAnimation, settingsPanelAnimation } from "../../animations";

import { useSelector, useDispatch } from "react-redux";

import { checkPDFInSourceFiles } from "../../store/slices/sourceFilesSlice/sourceFilesSlice";
import { getAllTargetFormats } from "../../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import IconCloseSettingsPanel from "../icons/IconCloseSettingsPanel";

import FormatSelect from "./FormatSelect";

import SliderInput from "./SliderInput";
import CheckboxInput from "./CheckboxInput";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";

const SettingsPanel = ({
  setSettingsPanelVisibility,
  settingsPanelVisibility,
}) => {
  const isPDF = useSelector(checkPDFInSourceFiles);
  const formats = useSelector(getAllTargetFormats);

  return (
    <AnimatePresence>
      {settingsPanelVisibility && (
        <>
          <StyledSettingsPanelBackground
            key="bg"
            variants={fadeAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
          />

          <StyledSettingsPanel
            key="panel"
            variants={settingsPanelAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <StyledCloseSettingsPanelHeader>
              <StyledCloseSettingsPanelButton
                onClick={() => setSettingsPanelVisibility(false)}
              >
                <IconCloseSettingsPanel />
              </StyledCloseSettingsPanelButton>

              <h1>Output settings</h1>
            </StyledCloseSettingsPanelHeader>

            <FormatSelect formats={formats} />

            <SliderInput />
            <CheckboxInput/>

             <SelectInput 
            options={
              ['pixels','percentages']
              }
              label={'Units:'}
              />

            <div className="temp">

          <NumberInput caption='width' units='pixels'/>
          <NumberInput caption='height' units='percentages' max={100}/>


            </div>

            <div className="temp">
            <NumberInput caption='resolution' defaultValue='72' units='ppi'/>
          <NumberInput caption='rotation' defaultValue='0' min={0} max={360} units='deg'/>
            </div>

           <SelectInput 
            options={
              ['off','low','medium','high']
              }
              label={'Resize smoothing:'}
              defaultValue={'low'}
              />

            <SelectInput 
            options={
              ['off','FloydSteinberg','FloydSteinberg-serpentine',
              'FalseFloydSteinberg', 'FalseFloydSteinberg-serpentine','Stucki', 'Stucki-serpentine','Atkinson','Atkinson--serpentine']
              }
              label={'Dither:'}
              />


            <SelectInput 
            options={
              ['PNG', 'JPEG']
              }
              label={'Compression:'}
              />


  

          </StyledSettingsPanel>
        </>
      )}
    </AnimatePresence>
  );
};

const StyledSettingsPanelBackground = styled(motion.div)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  backdrop-filter: blur(4px);
  opacity: 1;
  z-index: 2;
`;

const StyledSettingsPanel = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e3e3e3b6;
  backdrop-filter: blur(48px);
  width: 75vw;
  height: 100vh;
  border-radius: 2.5rem 0 0 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  z-index: 3;
  box-shadow: var(--container-shadow);

  @media (max-width: 500px) {
    width: 100vw;
  }

  .temp {
    margin:1rem;
    height:3rem;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledCloseSettingsPanelHeader = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 500px) {
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const StyledCloseSettingsPanelButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 768px) {
    top: 0;
    svg {
      width: 1.5rem;
    }
  }
`;

export default SettingsPanel;
