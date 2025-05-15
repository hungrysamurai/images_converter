// @ts-nocheck

export default function initMetrika() {
 if (import.meta.env.VITE_TARGET_DOMAIN === 'convert-it.ru') {
  (function (m, e, t, r, i, k, a) {
   m[i] =
    m[i] ||
    function () {
     (m[i].a = m[i].a || []).push(arguments);
    };
   m[i].l = 1 * new Date();
   for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) {
     return;
    }
   }
   k = e.createElement(t);
   a = e.getElementsByTagName(t)[0];
   k.async = 1;
   k.src = r;
   a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  ym(import.meta.env.VITE_YANDEX_METRICA_COUNTER_CONVERT_IT_RU, 'init', {
   defer: true,
   clickmap: true,
   trackLinks: true,
   accurateTrackBounce: true,
   webvisor: true,
  });
 }
}