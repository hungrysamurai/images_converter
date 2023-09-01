export const getNavigatorLang = () => {
  const navigatorLang = navigator.language.split("-")[0];
  if (navigatorLang === "ru") return "ru";
  else return "en";
};
