export const settingsPanelBackgroundAnimation = {
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

export const settingsPanelAnimation = {
  hidden: {
    x: "100%",
  },
  show: {
    x: 0,
    transition: {
      type: "easeIn",
      duration: 0.2,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "easeOut",
      duration: 0.2,
    },
  },
};

export const fileElementAnimation = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "easeIn",
      duration: 0.1,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      type: "easeOut",
      duration: 0.1,
    },
  },
};
