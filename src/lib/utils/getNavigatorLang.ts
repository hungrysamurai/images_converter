import { Lang } from '../types/types';

export const getNavigatorLang = (): Lang => {
  const navigatorLang = navigator.language.split('-')[0];
  if (navigatorLang === 'ru') return Lang.RU;
  else return Lang.EN;
};
