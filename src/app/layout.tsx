import type { Metadata } from "next";
import Script from "next/script";
import YandexMetrika from "../components/YandexMetrika";
import { Suspense } from "react";

import "./global.scss";
import { Ubuntu_Mono } from "next/font/google";

export const metadata: Metadata = {
  title:
    "Конвертёр изображений | JPEG в PDF | PDF в JPEG | HEIC в JPEG | JPEG в один PDF",
  description:
    "Конвертируем в PDF, JPEG, WEBP, GIF, TIFF, BMP, PNG. Конвертёр из HEIC в JPEG. Конвертировать без регистрации и смс.",
  keywords:
    "конверуем в PDF, конвертируем JPEG, конвертер пдф, конвертёр в jpeg, конвертировать heic, HEIC в JPEG, JPEG в PDF, конвертёр картинок, конвертируем изображения, PDF, JPEG, HEIC, WEBP, GIF, TIFF, BMP, PNG",
};

const ubuntu = Ubuntu_Mono({ weight: "400", subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.className}`}>
        <div className={`heading`}>
          <h1 className="main-heading">
            Конвертация изображений и документов PDF
          </h1>
          <h2 className="secondary-heading">
            Добавьте файлы разных форматов и сконвертируйте в нужный. Бесплатно.
          </h2>
        </div>

        <Script id="metrika-counter" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 
              ym(${process.env.METRIKA_ID}, "init", {
                    defer: true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });`}
        </Script>
        <Suspense fallback={<></>}>
          <YandexMetrika />
        </Suspense>
        <div id="root">{children}</div>
        <footer className={`${ubuntu.className}`}>
          Автор -{" "}
          <a href="https://hungrysamurai.ru" target="blank">
            hungrysamurai
          </a>
        </footer>
      </body>
    </html>
  );
}
