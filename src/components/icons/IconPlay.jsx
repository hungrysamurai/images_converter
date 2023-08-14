const IconPlay = () => {
  return (
    <svg
      width="36"
      height="45"
      viewBox="0 0 36 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_i_210_364)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.17183 0.275149C1.89424 -0.119254 2.77436 -0.0877289 3.4667 0.35735L34.9667 20.6073C35.6107 21.0213 36 21.7344 36 22.5C36 23.2656 35.6107 23.9786 34.9667 24.3927L3.4667 44.6426C2.77436 45.0877 1.89424 45.1193 1.17183 44.7248C0.449412 44.3304 0 43.5731 0 42.75V2.25C0 1.42694 0.449412 0.669553 1.17183 0.275149ZM4.5 6.37125V38.6287L29.5892 22.5L4.5 6.37125Z"
          fill="var(--icon-medium-gray)"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_210_364"
          x="0"
          y="0"
          width="36"
          height="47"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_210_364"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default IconPlay;
