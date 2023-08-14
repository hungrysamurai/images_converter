import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import {
  getActiveTargetFormat,
  getAllTargetFormats,
  switchTargetFormat,
} from "../store/slices/conversionSettingsSlice/conversionSettingsSlice";

import { getAllProcessedFiles } from "../store/slices/processFilesSlice/processFilesSlice";

import FilesList from "./filesList/FilesList";

const DownloadContainer = () => {

  const activeTargetFormat = useSelector(getActiveTargetFormat);
  const allTargetFormats = useSelector(getAllTargetFormats);
  const allProccecedFiles = useSelector(getAllProcessedFiles);
 
  const dispatch = useDispatch();

  const { name: currentFromatName } = allTargetFormats[activeTargetFormat];

  return (
    <StyledDownloadContainer>

      {allProccecedFiles.length === 0 ?
        <span
          className="placeholder"
          onClick={() => dispatch(switchTargetFormat())}
        >
          {currentFromatName.toUpperCase()}
        </span>
        :
        <FilesList files={allProccecedFiles} />
      }

    </StyledDownloadContainer>
  );
};

const StyledDownloadContainer = styled.div`
  width: 95%;
  height: 40vh;
  background-color: var(--bg-light-gray);
  border-radius: 0rem 0rem 2.5rem 2.5rem;
  box-shadow: var(--container-inner-shadow);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .placeholder {
    font-size: 6rem;
    font-weight: 500;
    color: var(--text-medium-gray);
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;
  }

  @media (max-width: 500px) {
    .placeholder {
      font-size: 3.5rem;
    }
  }
`;

export default DownloadContainer;
