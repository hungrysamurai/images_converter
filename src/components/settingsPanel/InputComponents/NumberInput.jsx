import styled from 'styled-components';
import { useState } from 'react';
const NumberInput = ({ caption, units, min, max, defaultValue, name, active}) => {

  const [numValue, setNumValue] = useState(defaultValue ? defaultValue : '');

  const handleChange = (e) => {
    console.log(e.target.value);
    setNumValue(e.target.value);
  }
  return (
    <StyledNumberContainer className={!active && 'inactive'}>
     <StyledNumberInput 
     type='number'
     placeholder={numValue ? numValue : 'auto'}
     value={numValue}
     onChange={handleChange}
     max={max ? max : null}
     min={min ? min : 1}
     name={name}
     />

    {caption && 
      <StyledNumberInputCaption>
        {caption}
      </StyledNumberInputCaption>
    }
    
    {units && 
      <StyledInputUnitsLabel>
        {units === 'pixels' ? 'px' : units==='percentages' ? '%' : units}
      </StyledInputUnitsLabel>
    }

     </StyledNumberContainer>
  )
}

const StyledNumberContainer = styled.label`
 margin: 1rem;
 position: relative;

   &.inactive{
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledNumberInput = styled.input`
 width:6rem;
 height:3rem;
 display: flex;
 align-items: center;
 justify-content: center;
 text-align: center;
 font-size: 1.5rem;
 font-family: inherit;
 border: 0.25rem solid var(--element-medium-gray);
 border-radius: 0.5rem;
 

 -moz-appearance:textfield;

 &::-webkit-inner-spin-button{
  -webkit-appearance: none;
 }

 &:focus{
  outline: none;
 }
`;

const StyledNumberInputCaption = styled.span`
position: absolute;
bottom:-1.25rem;
left: 50%;
transform: translateX(-50%);
color:var(--text-dark-gray);
font-size:1rem;
`

const StyledInputUnitsLabel = styled.div`
  position: absolute;
  width:2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  right:-2.25rem;
  top:50%;
  transform: translateY(-50%);
  color:var(--text-dark-gray);
  font-size:1rem;
`


export default NumberInput