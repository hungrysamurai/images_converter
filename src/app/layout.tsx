import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Конвертёр изображений | JPEG в PDF | PDF в JPEG | HEIC в JPEG | JPEG в один PDF",
  description:
    "Конвертируем в PDF, JPEG, WEBP, GIF, TIFF, BMP, PNG. Конвертёр из HEIC в JPEG. Конвертировать без регистрации и смс.",
  keywords:
    "конверуем в PDF, конвертируем JPEG, конвертер пдф, конвертёр в jpeg, конвертировать heic, HEIC в JPEG, JPEG в PDF, конвертёр картинок, конвертируем изображения, PDF, JPEG, HEIC, WEBP, GIF, TIFF, BMP, PNG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
