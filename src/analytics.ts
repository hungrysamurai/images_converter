// @ts-nocheck
export default function initGoogleAnalytics() {
 if (import.meta.env.VITE_TARGET_DOMAIN === 'convert-it.ru') {
  const GA_ID = `G-${import.meta.env.VITE_GOOGLE_ANALYTICS_ID_CONVERT_IT_RU}`;

  if (!GA_ID) return;

  // Подключение скрипта Google Analytics
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  // Инициализация
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;
  document.head.appendChild(script2);
 }

}
