import type { Variants } from 'framer-motion';

export const settingsPanelBackgroundAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const settingsPanelAnimation: Variants = {
  hidden: {
    x: '100%',
  },
  show: {
    x: 0,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  },
  exit: {
    x: '100%',
    transition: {
      ease: 'easeOut',
      duration: 0.2,
    },
  },
};

export const fileElementAnimation: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeIn',
      duration: 0.1,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.1,
    },
  },
};

export const filePreviewIconAnimation: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeIn',
      duration: 0.1,
      delay: 0.1,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.1,
    },
  },
};

export const fileInfoContainerAnimation: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeIn',
      duration: 0.1,
      delay: 0.1,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.1,
    },
  },
};

export const fadeAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.2,
    },
  },
};

// same timing as the preview icon, but without the vertical shift: the handle sits in a corner
export const dragHandleAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      ease: 'easeIn',
      duration: 0.1,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.1,
    },
  },
};
