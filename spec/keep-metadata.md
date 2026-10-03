# Сохранение метаданных (EXIF) при конвертации в JPEG

## Problem Statement

При любой конвертации конвертер полностью стирает метаданные исходного файла: дату и время съёмки, модель камеры и объектива, параметры экспозиции, геоданные, автора. Для большинства сценариев это нормально и даже полезно, но есть пользователи, которым метаданные нужны:

- владельцы iPhone конвертируют HEIC в JPEG и теряют дату съёмки и место. После импорта в фотобиблиотеку, облако или галерею снимки сортируются по дате конвертации, а не по дате съёмки, и пропадают с карты;
- фотографы пережимают или уменьшают JPEG и теряют информацию о камере, экспозиции и авторстве;
- пользователи конвертируют WebP, PNG или AVIF с метаданными в JPEG для совместимости и тоже теряют дату и прочие сведения.

Сейчас сохранить метаданные невозможно: все выходные форматы проходят через перерисовку на canvas, и в выходной файл попадают только пиксели.

## Solution

- В настройках выходного формата JPEG появляется отдельная секция с переключателем «Сохр. метаданные» / «Keep metadata:». По умолчанию он выключен: поведение для всех пользователей остаётся прежним, метаданные стираются.
- При включённом переключателе EXIF исходного файла переносится в выходной JPEG, если исходник в формате JPEG, HEIC, AVIF, WebP или PNG и содержит EXIF.
- Переносится всё, включая геоданные, кроме полей, которые после конвертации стали бы неправдой:
  - ориентация сбрасывается в «нормальную», потому что изображение уже повёрнуто правильно, и просмотрщики не повернут его второй раз;
  - размеры изображения в EXIF заменяются фактическими размерами результата (с учётом ресайза);
  - встроенная миниатюра старого изображения удаляется.
- Если у исходника нет EXIF, или он не читается, или после очистки слишком велик для JPEG, файл конвертируется как обычно, без метаданных и без ошибки для пользователя.
- Переключатель запоминается между визитами, как остальные настройки. Уже сохранённые настройки пользователей при обновлении не сбрасываются.
- Секция показывается только для выходных форматов, которые умеют записывать метаданные. В этой итерации это только JPEG.

## User Stories

1. As a user, I want a "Keep metadata" toggle in the JPEG output settings, so that I can choose whether the source metadata survives conversion.
2. As a user, I want the toggle to be off by default, so that conversion keeps stripping metadata as it always did unless I opt in.
3. As a privacy-conscious user, I want the default output to contain no metadata, so that I don't accidentally share location or camera details.
4. As an iPhone user, I want to convert HEIC photos to JPEG with the original capture date, so that my photo library sorts them correctly.
5. As an iPhone user, I want GPS coordinates to be preserved when I enable the toggle, so that converted photos still appear on the map in my gallery.
6. As an iPhone user, I want converted portrait-oriented photos to display upright, so that they are not rotated twice by viewers.
7. As a photographer, I want to recompress a JPEG at lower quality while keeping camera, lens and exposure data, so that I don't lose shooting information.
8. As a photographer, I want to resize a JPEG and keep its EXIF, so that downscaled copies still carry authorship and capture data.
9. As a photographer, I want the image dimensions recorded in EXIF to match the resized output, so that tools reading EXIF don't report wrong sizes.
10. As a user, I want an EXIF-oriented JPEG (e.g. rotated 90° by the camera) to stay upright after conversion with metadata kept, so that orientation is not applied twice.
11. As a user, I want to convert WebP images with EXIF to JPEG and keep the metadata, so that compatibility conversion doesn't lose information.
12. As a user, I want to convert PNG images with EXIF to JPEG and keep the metadata, so that the capture data survives.
13. As a user, I want to convert AVIF images with EXIF to JPEG and keep the metadata, so that modern-format photos keep their data.
14. As a user, I want files without EXIF to convert normally when the toggle is on, so that a mixed batch never fails because of metadata.
15. As a user, I want a file with corrupted or unreadable EXIF to still convert, just without metadata, so that a metadata problem never costs me the image.
16. As a user, I want a file whose metadata is too large for JPEG to still convert, just without metadata, so that I always get a valid JPEG.
17. As a user, I want the stale embedded thumbnail to be dropped, so that viewers never show a preview of a different (unrotated or unresized) image.
18. As a user, I want colors of the output to stay correct when metadata is kept, so that enabling the toggle has no visual side effects.
19. As a user, I want the toggle state to be remembered between visits, so that I don't have to re-enable it every time.
20. As a returning user, I want my existing saved settings (quality, resize, active format) to survive the update that adds this toggle, so that I don't have to reconfigure the app.
21. As a user, I want "Reset" for the JPEG format to turn the toggle off again, so that reset brings back all defaults.
22. As a user, I want the metadata section to appear only for formats that support it, so that I'm not shown a toggle that does nothing.
23. As a user, I want the metadata section to be visually separated from format-specific and resize settings, so that the panel stays easy to scan.
24. As a Russian-speaking user, I want the toggle labeled in Russian with "Вкл"/"Выкл" values, so that it is consistent with the rest of the UI.
25. As an English-speaking user, I want the toggle labeled "Keep metadata:" with "On"/"Off" values, so that it is consistent with the rest of the UI.
26. As a user converting a batch of mixed formats (JPEG, HEIC, PNG, GIF, PDF) to JPEG with the toggle on, I want every file that has EXIF to keep it and every other file to convert as usual, so that one setting works for the whole batch.
27. As a user converting a GIF, BMP, TIFF, SVG or PDF to JPEG with the toggle on, I want normal conversion without errors, so that unsupported sources are handled gracefully.
28. As a user on a device where the conversion worker fails and the app falls back to the main thread, I want metadata to be kept the same way, so that behavior doesn't depend on the processing path.
29. As a user with the toggle on, I want conversion speed to be essentially unchanged, so that keeping metadata has no noticeable cost.
30. As a user with the toggle off, I want zero overhead from the metadata feature, so that the default path stays as fast as before.
31. As a developer, I want metadata support to be declared per format in the format registries, so that adding EXIF writing for WebP or PNG later doesn't require touching the pipeline or the UI.
32. As a developer, I want metadata problems to be logged to the console, so that I can diagnose why a file came out without EXIF.
33. As a developer, I want EXIF handling covered by automated tests with synthetic fixtures, so that byte-level edge cases are verified without committing real personal photos.

## Implementation Decisions

**Scope**
- Выходной формат с записью метаданных: только JPEG.
- Источники, из которых извлекается EXIF: JPEG, HEIC, AVIF, WebP, PNG. Остальные входные форматы (GIF, BMP, TIFF, SVG, PDF) EXIF не отдают.

**Без сторонних библиотек.** Пишется собственный небольшой модуль EXIF, который переносит сырые байты EXIF (TIFF-структуру) и правит несколько тегов на месте. Полный парсинг или сериализация EXIF не нужны. `piexifjs` (заброшен, только JPEG, binary strings) и `exifr` (только чтение, распарсенные объекты) не подходят.

**Модуль EXIF (deep module, чистые функции над байтами)**
- Экстракторы по контейнерам. На вход байты исходного файла, на выход сырые TIFF-байты EXIF или «нет EXIF»:
  - JPEG: проход по маркерам до сегмента APP1 с заголовком `Exif\0\0`;
  - ISOBMFF (общий для HEIC и AVIF): поиск item типа `Exif` через `meta`/`iinf`/`iloc`, чтение данных по `iloc` с учётом смещения до TIFF-заголовка, которое лежит в начале payload'а;
  - WebP: RIFF-чанк `EXIF`;
  - PNG: чанк `eXIf` в любой позиции файла, в том числе после `IDAT`.
- Патчер TIFF-структуры. На вход сырые TIFF-байты и фактические ширина/высота результата, на выход очищенные байты:
  - поддерживает оба порядка байт (`II` и `MM`);
  - `Orientation` (IFD0) → 1, перезапись значения на месте;
  - `PixelXDimension`/`PixelYDimension` (Exif IFD) → фактические размеры, на месте, с учётом типа SHORT/LONG;
  - IFD1 (миниатюра) удаляется: обнуляется ссылка next-IFD у IFD0, данные миниатюры отбрасываются;
  - некорректная структура (выход за границы, неверный заголовок) даёт ошибку, а не мусор.
- JPEG-writer. На вход закодированный JPEG и очищенные TIFF-байты, на выход JPEG с сегментом APP1 `Exif\0\0`, вставленным сразу после SOI. Существующий EXIF в выходе (canvas его не пишет) не ожидается. Если payload APP1 превышает 65533 байта, writer отказывается писать, и выдаётся файл без метаданных.

**Расширение реестров форматов**
- Реестр входных форматов получает опциональное lazy-поле с экстрактором EXIF, по аналогии с `loadDecoder`. Заполняется для JPEG, HEIC, AVIF, WebP, PNG.
- Реестр выходных форматов получает опциональное lazy-поле с writer'ом EXIF, по аналогии с `loadAggregator`. Заполняется только для JPEG.
- Рядом с существующим хелпером «нужно ли мержить» появляется хелпер «поддерживает ли цель метаданные» (по наличию writer'а). Его используют и UI, и пайплайн.
- Все импорты остаются lazy: реестры входят в бандл воркера.

**Пайплайн**
- Сигнатуры декодеров и энкодеров не меняются. Метаданные обрабатываются отдельным шагом в общей функции пайплайна, которую используют и воркер, и main-thread fallback.
- EXIF извлекается, только если одновременно включена настройка, у входного формата есть экстрактор и у выходного есть writer. Тогда исходник читается по blob URL повторно, независимо от декодера. При выключенной настройке накладных расходов нет.
- Патч выполняется после ресайза и фона, по размерам финального canvas, сразу перед записью в закодированный blob.
- Многокадровых источников с EXIF нет: у WebP/AVIF декодируется только первый кадр, поэтому EXIF применяется к единственному выходному кадру.
- Любая ошибка в извлечении, патче или записи перехватывается: выдаётся `console.warn`, файл отдаётся без метаданных, конвертация не падает.

**Настройки и состояние**
- Тип настроек JPEG выделяется из общего с WebP/AVIF типа и получает поле `keepMetadata: boolean`, по умолчанию `false`.
- Новый редьюсер `setKeepMetadata` в стиле существующих format-specific редьюсеров: игнорируется, если у активного формата нет такого поля.
- Сброс активного формата возвращает `keepMetadata` к `false` за счёт существующей логики сброса.

**Persist**
- Reconciler persisted-настроек мержит дефолты с сохранённым состоянием **на уровне ключей каждого формата**: дефолтные настройки формата перекрываются сохранёнными. Новые поля внутри существующих форматов получают дефолты без бампа версии.
- `CONVERSION_SETTINGS_VERSION` не поднимается. Комментарий в store обновляется: бамп нужен только при переименовании или удалении полей и смене их смысла, а не при добавлении.

**UI**
- В панели выходных настроек появляется отдельная секция между блоком настроек формата и блоком ресайза, отделённая divider'ом. Она рендерится по хелперу поддержки метаданных, а не по switch по формату.
- Используется существующий `CheckboxInput`. Подписи: EN `Keep metadata:`, RU `Сохр. метаданные`. Значения `On`/`Off` и `Вкл`/`Выкл`. Без подсказок и предупреждений о GPS.

**Тестирование**
- В проект добавляется vitest, который хорошо работает с Vite. Тесты пока только для модуля EXIF. Появляется скрипт `test`.
- Фикстуры синтетические и собираются программно в тестовых хелперах, бинарников в репозитории нет:
  - билдер TIFF-структуры: `II`/`MM`, Orientation, размеры SHORT/LONG, с IFD1 и без, GPS IFD;
  - обёртки контейнеров: JPEG APP1, ISOBMFF (`meta`/`iinf`/`iloc`), RIFF `EXIF`, PNG `eXIf`, в том числе после `IDAT`.
- Round-trip тесты: извлечь → пропатчить → записать → извлечь снова. Проверяется, что Orientation = 1, размеры совпадают с заданными, IFD1 отсутствует, остальные теги (дата, GPS-указатель, модель камеры) байт-в-байт сохранены.
- Граничные тесты: нет EXIF, обрезанный или битый EXIF, EXIF больше лимита APP1, big-endian.
- Ручная проверка: реальный HEIC с iPhone → JPEG с включённой настройкой. В `exiftool` проверяются дата, GPS и модель камеры, а также что изображение отображается не перевёрнутым дважды.

## Out of Scope

- Запись метаданных в форматы, отличные от JPEG: WebP, PNG, AVIF, TIFF, GIF, BMP, PDF. В том числе маппинг EXIF в Info dictionary или XMP у PDF. Архитектура это допускает, но реализация отложена.
- Извлечение EXIF из TIFF (требует пересборки IFD без данных изображения), а также из GIF, BMP, SVG, PDF.
- Перенос метаданных PDF (Info/XMP) при конвертации PDF в изображения.
- XMP, IPTC и прочие блоки метаданных, кроме EXIF.
- ICC-профили: не копируются, потому что пиксели после canvas уже в sRGB, и приклеенный исходный профиль исказил бы цвета.
- Выборочное удаление полей (GPS, серийные номера, автор) и любые режимы, кроме «всё / ничего».
- Генерация новой миниатюры IFD1.
- Сохранение EXIF у аккумулированных результатов (merge в GIF/PDF): эти форматы не входят в scope.
- Отображение или редактирование метаданных в UI.
- Тесты за пределами модуля EXIF.

## Further Notes

- Двойного поворота нужно избегать, потому что декодеры отдают уже ориентированные пиксели: `createImageBitmap` по умолчанию применяет EXIF Orientation, libheif применяет трансформации `irot`/`imir`. Поэтому `Orientation` = 1 строго обязателен, а не опционален.
- Лимит сегмента APP1 в JPEG — 65535 байт вместе с полем длины, то есть 65533 байта payload'а, включая заголовок `Exif\0\0`. После удаления миниатюры EXIF практически всегда в него укладывается.
- Мусор от удалённой миниатюры, оставшийся внутри TIFF-блока, допустимо обрезать только если он лежит в хвосте. В общем случае достаточно разорвать ссылку на IFD1 и отбросить данные по `JPEGInterchangeFormat`/`Length`, если их можно безопасно отрезать.
- Будущее расширение: при добавлении флага удаления GPS поле `keepMetadata` естественно превращается в select, а благодаря поключевому мержу persist миграция будет тривиальной.
- Будущее расширение: writer'ы для WebP (чанк `EXIF` + флаг в `VP8X`) и PNG (`eXIf`) подключаются через реестр выходных форматов без изменений в пайплайне и UI.
