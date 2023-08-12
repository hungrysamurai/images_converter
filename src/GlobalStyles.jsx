import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    height: 100vh;
    font-family: 'Kanit', sans-serif;
  }

  h1{
    font-size: 3rem;
    font-weight: 300;
  }

  h2 {
    font-size: 2rem;
    font-weight: 500;
  }

  h3{
    font-size: 1.5rem;
    font-weight: 500;
  }

  p {
    font-weight: 400;
  }

  #root {
    --color-primary: #94d2bd;

    --bg-container-gray: #E3E3E3;
    --bg-light-gray: #F8F8F8;
    --icon-gray: #9F9F9F;
    --icon-disabled-gray: #F8F8F8;
    --text-dark-gray: #373737;
    --text-medium-gray: #9f9f9f;
    --text-light-gray: #f8f8f8;

    --format-color-jpeg:#011627;
    --format-color-png:#1B8ACB;
    --format-color-bmp:#FDFFFC;
    --format-color-webp:#852236;
    --format-color-tiff:#E71D36;
    --format-color-gif:#2EC4B6;
    --format-color-pdf:#FF9F1C;

    --container-inner-shadow: box-shadow: 0px 24px 48px 0px rgba(0, 0, 0, 0.25) inset;
    --image-element-shadow: box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25); 
    --icon-inner-shadow: box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25) inset;

    height: 100vh;
    width: 100vw;
    background-color: var(--bg-container-gray);
  }
`;

export default GlobalStyles;
