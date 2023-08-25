import styled from 'styled-components';

const SelectInput = ({options, label, defaultValue}) => {
 const handleChange = (e) => {
 }

  return (
    <StyledInputContainer>
       <StyledLabel>
        {label}
        <StyledSelect
          onChange={handleChange}
          defaultValue={defaultValue ? defaultValue : null}
        >
          {options.map((optionName, i) => (
            <option key={i} value={optionName}>
              {optionName}
            </option>
          ))}
        </StyledSelect>
      </StyledLabel>
    </StyledInputContainer>
  )
}

const StyledInputContainer = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin:1rem;
`;

const StyledLabel = styled.label`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 12rem;
  max-width: 80%;
  height: 3rem;
  border: 0.25rem solid var(--element-medium-gray);
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark-gray);
  background: var(--bg-light-gray);
  cursor: pointer;
`;

export default SelectInput