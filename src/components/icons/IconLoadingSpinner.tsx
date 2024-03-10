import { motion } from "framer-motion";
import { memo } from "react";

const IconLoadingSpinner: React.FC = memo(function IconLoadingSpinner() {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{
        ease: "linear",
        duration: 1,
        repeat: Infinity,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_i_367_370)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.9999 0C25.2049 0 26.1818 0.976833 26.1818 2.18182V10.9091C26.1818 12.1141 25.2049 13.0909 23.9999 13.0909C22.7949 13.0909 21.8181 12.1141 21.8181 10.9091V2.18182C21.8181 0.976833 22.7949 0 23.9999 0Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.9999 34.9091C25.2049 34.9091 26.1818 35.8859 26.1818 37.0909V45.8181C26.1818 47.0231 25.2049 48 23.9999 48C22.7949 48 21.8181 47.0231 21.8181 45.8181V37.0909C21.8181 35.8859 22.7949 34.9091 23.9999 34.9091Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.03186 7.03174C7.88392 6.17969 9.26537 6.17969 10.1174 7.03174L16.292 13.2063C17.144 14.0583 17.144 15.4398 16.292 16.2918C15.4399 17.1439 14.0585 17.1439 13.2064 16.2918L7.03186 10.1173C6.17981 9.26524 6.17981 7.88379 7.03186 7.03174Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.7081 31.7081C32.5602 30.856 33.9416 30.856 34.7937 31.7081L40.9682 37.8826C41.8203 38.7347 41.8203 40.1161 40.9682 40.9682C40.1162 41.8202 38.7347 41.8202 37.8827 40.9682L31.7081 34.7936C30.8561 33.9416 30.8561 32.5601 31.7081 31.7081Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 24C0 22.795 0.976833 21.8182 2.18182 21.8182H10.9091C12.1141 21.8182 13.0909 22.795 13.0909 24C13.0909 25.205 12.1141 26.1818 10.9091 26.1818H2.18182C0.976833 26.1818 0 25.205 0 24Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.9091 24C34.9091 22.795 35.8859 21.8182 37.0909 21.8182H45.8181C47.0231 21.8182 48 22.795 48 24C48 25.205 47.0231 26.1818 45.8181 26.1818H37.0909C35.8859 26.1818 34.9091 25.205 34.9091 24Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.292 31.7081C17.144 32.5601 17.144 33.9416 16.292 34.7936L10.1174 40.9682C9.26537 41.8202 7.88391 41.8202 7.03186 40.9682C6.17981 40.1161 6.17981 38.7347 7.03186 37.8826L13.2064 31.7081C14.0585 30.856 15.4399 30.856 16.292 31.7081Z"
          fill="#9F9F9F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40.9682 7.03174C41.8203 7.88379 41.8203 9.26524 40.9682 10.1173L34.7937 16.2918C33.9416 17.1439 32.5602 17.1439 31.7081 16.2918C30.8561 15.4398 30.8561 14.0583 31.7081 13.2063L37.8827 7.03174C38.7347 6.17969 40.1162 6.17969 40.9682 7.03174Z"
          fill="#9F9F9F"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_367_370"
          x="0"
          y="0"
          width="48"
          height="49.9999"
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
            result="effect1_innerShadow_367_370"
          />
        </filter>
      </defs>
    </motion.svg>
  );
});

export default IconLoadingSpinner;
