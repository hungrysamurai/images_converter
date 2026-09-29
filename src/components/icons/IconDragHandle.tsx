import { ElementColorMode } from '@/types/types';

type IconProp = {
  bg: ElementColorMode;
};

const IconDragHandle: React.FC<IconProp> = ({ bg }) => {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3" fill={`var(--icon-${bg}-gray)`} />
      <circle cx="16" cy="6" r="3" fill={`var(--icon-${bg}-gray)`} />
      <circle cx="6" cy="16" r="3" fill={`var(--icon-${bg}-gray)`} />
      <circle cx="16" cy="16" r="3" fill={`var(--icon-${bg}-gray)`} />
    </svg>
  );
};

export default IconDragHandle;
