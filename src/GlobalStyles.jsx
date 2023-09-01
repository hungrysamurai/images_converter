import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html{
    height:100%;
    width:100%;
    overflow: hidden;
  }

  body {
    height:100%;
    width:100%;
    font-family: 'Ubuntu Mono', monospace;

    --bg-container-gray: #E3E3E3;
    --bg-light-gray: #F8F8F8;
    --icon-medium-gray: #9F9F9F;
    --icon-dark-gray: #373737;
    --icon-light-gray: #F8F8F8;
    --text-dark-gray: #373737;
    --text-medium-gray: #9f9f9f;
    --text-light-gray: #f8f8f8;

    --element-light-gray:#F8F8F8;
    --element-medium-gray:#9f9f9f;
    --element-dark-gray: #373737;

    --format-color-jpeg:#011627;
    --format-color-png:#1B8ACB;
    --format-color-bmp:#FDFFFC;
    --format-color-webp:#852236;
    --format-color-tiff:#E71D36;
    --format-color-gif:#2EC4B6;
    --format-color-pdf:#FF9F1C;
    --format-color-heic:#8E06F9;

    --container-inner-shadow: 0px 24px 36px 0px rgba(0, 0, 0, 0.33) inset;
    --image-element-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.33); 
    --container-shadow: -12px 0px 24px 0px rgba(0, 0, 0, 0.25); 
  }

  #root {
    position: relative;
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--bg-container-gray);
    padding-top: 1rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 400;
    color: var(--text-medium-gray);
      
    @media (max-width: 768px){
        font-size: 2rem;
      }
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark-gray);

      @media (max-width: 768px){
        font-size: 1.25rem;
      }
  }

  h3{
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark-gray);

      @media (max-width: 768px){
        font-size: 1rem;
      }
  }

  p {
    font-weight: 400;
  }
`;

export default GlobalStyles;
