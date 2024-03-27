import { memo } from "react";

const IconPlay: React.FC = memo(function IconPlay() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <path
        d="M8.41162,45.0752a2.99964,2.99964,0,0,1-3-3V8.12939A3,3,0,0,1,9.88477,5.51611L40.06934,22.5332a3,3,0,0,1-.00586,5.2295L9.87891,44.69141A2.99745,2.99745,0,0,1,8.41162,45.0752Zm3-31.81055V36.95313l21.063-11.81348Z"
        fill="var(--icon-medium-gray)"
      />
    </svg>
  );
});

export default IconPlay;
