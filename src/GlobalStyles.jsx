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
    height: 100vh;
    width: 100vw;
  }
`;

export default GlobalStyles;