import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html{
    overflow: hidden;
  }

  body {
    font-family: 'Ubuntu Mono', monospace;
    background-color: var(--bg-container-gray);

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

    --container-inner-shadow: inset 0px 24px 24px 0px rgba(0, 0, 0, 0.25), inset 0px 6px 6px 6px rgba(0, 0, 0, 0.16) ;
    --image-element-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.33); 
    --container-shadow: -12px 0px 24px 0px rgba(0, 0, 0, 0.33); 
    --round-corner: 1.25rem;

    --full: 95%;

    --panel-thickness: 3rem;
    --panel-fit: var(--full);

    --container-calc: calc((100% - (var(--panel-thickness) * 2 + 3rem)) / 2);
    --container-fit: var(--full);

      @media (min-aspect-ratio: 1/1) {
   --container-calc: calc((100% - (var(--panel-thickness) * 2 + 1rem)) / 2);
   --full: calc(95% - 1rem);
  }
  }

  #root {
    position: relative;
    overflow: hidden;
    background-color: var(--bg-container-gray);
   
    @media (max-aspect-ratio: 1/1) {
      padding-top: 0.5rem;
      padding-left: 0;
    }

    @media (min-aspect-ratio: 1/1) {
      padding-top: 0;
      padding-left: 0.5rem;
    }
  }

  h1 {
    font-size: 3rem;
    font-weight: 400;
    color: var(--text-medium-gray);
      
    @media screen and (max-width: 768px), 
       screen and (max-height: 500px) {
        font-size: 2rem;
    }
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark-gray);

      @media screen and (max-width: 768px), 
       screen and (max-height: 500px){
        font-size: 1.25rem;
      }
  }

  h3{
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark-gray);

     @media screen and (max-width: 768px), 
       screen and (max-height: 500px){
        font-size: 1rem;
      }
  }

  p {
    font-weight: 400;
  }
`;

export default GlobalStyles;
