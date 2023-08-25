import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { 
  getActiveTargetFormat,
  getActiveFormatOutputSettings
 } from '../../store/slices/conversionSettingsSlice/conversionSettingsSlice';

 import CheckboxInput from './InputComponents/CheckboxInput';
 import SelectInput from './InputComponents/SelectInput';
 import NumberInput from './InputComponents/NumberInput';

const OutputSettings = () => {
  const activeTargetFormatName = useSelector(getActiveTargetFormat);
  const activeTargetFromatOutputSettings = useSelector(getActiveFormatOutputSettings);

  const { resize, units } = activeTargetFromatOutputSettings;
  console.log(activeTargetFromatOutputSettings);
  console.log(units);
  return (
    <StyledOutputSettingsContainer>
      <StyledResizeOptionsContainer>
        <CheckboxInput currentValue={resize}/>
         <SelectInput 
            options={['pixels','percentages']}
            label={'Units:'}
            name='units'
            currentValue={units}
            active={resize}
          />

          <StyledResizeDimensionsContainer>
            <NumberInput 
              caption='width' 
              units={units}
              active={resize}
              name='targetWidth'/>
            <NumberInput 
              caption='height' 
              units={units} 
              active={resize}
              name='targetHeight'
            />
          </StyledResizeDimensionsContainer>

      </StyledResizeOptionsContainer>
    </StyledOutputSettingsContainer>
  )
}

const StyledOutputSettingsContainer = styled.div`
width:100%;
margin-top: 1rem;
height: calc(100% - 23vh);
display: flex;
align-items: center;
justify-content: flex-start;
flex-direction: column;
`

const StyledResizeOptionsContainer = styled.div`
width:100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`

const StyledResizeDimensionsContainer = styled.div`
    margin:1rem;
    height:3rem;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

export default OutputSettings