import { ElementColorMode } from '../../types/types';

type IconProp = {
  bg: ElementColorMode;
};

const IconRemoveElement: React.FC<IconProp> = ({ bg }) => {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
        fill={`var(--icon-${bg}-gray)`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289Z"
        fill={`var(--icon-${bg}-gray)`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L14.7071 13.2929C15.0976 13.6834 15.0976 14.3166 14.7071 14.7071C14.3166 15.0976 13.6834 15.0976 13.2929 14.7071L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z"
        fill={`var(--icon-${bg}-gray)`}
      />
    </svg>
  );
};

export default IconRemoveElement;
