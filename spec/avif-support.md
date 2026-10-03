# AVIF: поддержка на входе и на выходе

## Problem Statement

AVIF стал массовым форматом: его отдают CDN, сохраняют браузеры («Сохранить картинку как…»), экспортируют современные камеры и редакторы. Многие пользователи не могут открыть такие файлы в привычных просмотрщиках, редакторах или загрузить их на сайты, которые принимают только JPEG/PNG. Конвертер AVIF не принимает вовсе: такие файлы молча отбрасываются при загрузке.

Пользователи, которым нужен компактный современный формат для веба, не могут получить AVIF на выходе: из доступных форматов самый компактный — WEBP.

Кроме того, при загрузке файлов с пустым MIME-типом (что бывает у AVIF, HEIC и других форматов на Windows без нужных кодеков и на некоторых Linux) файл отбрасывается без какого-либо сообщения. Исключение — HEIC, для которого есть отдельный обходной путь.

## Solution

- Конвертер принимает AVIF-файлы наравне с остальными форматами: их можно перетащить или выбрать в диалоге, они показываются в списке со своим цветом, их можно просмотреть и сконвертировать в любой выходной формат.
- AVIF появляется в списке выходных форматов сразу после WEBP с единственной настройкой «Качество» (по умолчанию 60) и общими настройками ресайза. Прозрачность сохраняется.
- Файлы распознаются по MIME-типу, а если он пустой или неизвестный — по расширению, для всех поддерживаемых форматов.
- Диалог выбора файлов показывает только поддерживаемые файлы, а строка с перечнем форматов на экране загрузки всегда соответствует реальной поддержке.
- Сохранённые настройки пользователей не теряются при добавлении нового формата.
- Кодирование AVIF не перегружает память устройства и никогда не подвешивает интерфейс.

## User Stories

1. As a user, I want to drag and drop an AVIF file onto the upload area, so that I can convert it like any other image.
2. As a user, I want to pick AVIF files in the file selection dialog, so that I don't have to rename or pre-convert them.
3. As a user, I want to convert AVIF to JPEG, so that I can open the image in software that doesn't support AVIF.
4. As a user, I want to convert AVIF to PNG, so that I keep transparency and lossless quality.
5. As a user, I want to convert AVIF to WEBP, BMP, GIF, TIFF and PDF, so that every existing output format works with AVIF input.
6. As a user, I want transparent areas of an AVIF to become white when converting to a format without alpha (JPEG, BMP, GIF, PDF), so that they don't turn black.
7. As a user, I want to resize an AVIF image during conversion, so that I get the target dimensions in one step.
8. As a user, I want several AVIF files to be merged into one PDF or GIF when I enable merging, so that AVIF behaves like other inputs.
9. As a user, I want AVIF files in the list to have their own recognizable color, so that I can tell formats apart at a glance.
10. As a user, I want to preview an uploaded AVIF file, so that I can check it's the right image before converting.
11. As a user, I want an animated AVIF to convert into a still image of its first frame, so that I still get a usable result instead of an error.
12. As a user on Windows without the AV1 codec extension, I want my AVIF files to be accepted even though the system reports no file type, so that they don't silently disappear.
13. As a user on Linux without full MIME databases, I want files to be recognized by extension, so that uploading works regardless of system configuration.
14. As a user, I want `.jpg`, `.jpe`, `.jfif`, `.tif`, `.heif` and other common extension variants to be recognized, so that alternatively named files are not lost.
15. As a user, I want the file selection dialog to show only supported files, so that I don't have to hunt through unrelated files.
16. As a user, I want the list of supported formats on the upload screen to mention AVIF, so that I know it's supported.
17. As a user, I want to choose AVIF as the target format, so that I can get smaller files for the web.
18. As a user, I want AVIF to be listed right after WEBP in the target format selector, so that I find it next to the similar modern format.
19. As a user, I want to cycle to AVIF with the "next format" control, so that it behaves like other formats.
20. As a user, I want a quality slider for AVIF output, so that I can trade file size for visual quality.
21. As a user, I want a sensible default AVIF quality, so that I get a good size/quality balance without tweaking.
22. As a user, I want AVIF output to keep transparency, so that converting PNG logos to AVIF doesn't add a background.
23. As a user, I want converted AVIF files to have the `.avif` extension, both individually and inside the ZIP archive, so that they open correctly.
24. As a user, I want to be told about an error instead of silently receiving a PNG named as something else, so that I can trust the output format.
25. As a user converting many large photos to AVIF, I want the conversion not to crash the tab from running out of memory, so that the batch completes.
26. As a mobile user, I want AVIF encoding to stay within my device's memory, so that the browser doesn't kill the page.
27. As a user, I want the interface to stay responsive while AVIF files are being encoded, so that I can keep interacting with the page.
28. As a user, I want a file that fails to encode to AVIF to be marked as failed without blocking the others, so that the rest of the batch still converts.
29. As a user who doesn't choose AVIF output, I want the page not to download the AVIF encoder, so that the converter stays fast to load.
30. As a returning user, I want my saved settings (target format, quality, resize) to be kept after the update, so that I don't have to configure everything again.
31. As a returning user, I want to be able to select AVIF immediately after the update without errors, so that new formats just work.
32. As a user searching for an AVIF converter, I want the site description to mention AVIF, so that I can find the converter.
33. As a developer, I want a single source of truth for format extensions, so that MIME detection, the `accept` attribute and the formats list never drift apart.
34. As a developer, I want each output format to declare its maximum worker concurrency, so that heavy WASM encoders don't exhaust memory.
35. As a developer, I want each output format to declare whether a main-thread fallback is allowed, so that heavy encoders never run in the UI thread.
36. As a developer, I want adding a new format to not require a persisted-state version bump, so that users don't lose settings on every format addition.
37. As a developer, I want the canvas encoder to fail loudly on an unsupported MIME type, so that silent browser fallbacks are caught immediately.
38. As a developer, I want the native browser decoder to have a format-neutral name, so that it's clear it serves JPEG, PNG, WEBP and AVIF.

## Implementation Decisions

**Format model**
- AVIF is added to the list of output formats right after WEBP. The input format list is derived from the output list, so AVIF becomes an input format automatically.
- The MIME table gets an `image/avif` entry.
- A new extensions table maps every input format to all of its accepted extensions (e.g. jpeg → jpg/jpeg/jpe/jfif, tiff → tif/tiff, heic → heic/heif, avif → avif). It is the single source of truth for extension fallback, the file input's `accept` attribute and the formats list text on the upload screen.

**Input detection**
- A new resolver takes a `File` and returns a supported MIME type or nothing. It checks `file.type` against the MIME table first, and on failure looks up the file extension in the extensions table.
- If the resolved type differs from `file.type`, the file is rewrapped with the resolved type before it enters the store.
- The HEIC-specific detection helper is removed; upload handling becomes a single branch built on the resolver.
- The file input gets an `accept` attribute built from all MIME types and all extensions.
- The supported formats line on the upload screen is generated from the input formats list.

**Decoding**
- AVIF uses the browser's native decoding (`createImageBitmap` → `OffscreenCanvas`) in the worker. There is no WASM fallback: browsers capable of running the worker pipeline (`OffscreenCanvas` in workers) all decode AVIF natively.
- The existing JPEG/PNG/WEBP decoder module is renamed to a format-neutral "native" decoder and shared by JPEG, PNG, WEBP and AVIF.
- An animated AVIF yields only its first frame (same as animated WEBP today).
- AVIF is a preview format (the browser renders it in `<img>`); no change to the preview predicate is needed.
- UI color: a dedicated format color token for AVIF and dark element text color mode.

**Encoding**
- Browsers do not encode AVIF via canvas (`convertToBlob` silently returns PNG), so AVIF output uses the `@jsquash/avif` WASM encoder (libavif + aom), single-threaded build, no COOP/COEP headers.
- The encoder converts the canvas to `ImageData` and calls the jsquash encoder with the user's `quality` and a fixed `speed` of 6, both internal constants of the encoder module.
- The encoder module is loaded lazily from the output format registry, so the WASM is downloaded only when AVIF is the target.
- Output registry entry: alpha supported (no white background is applied), no aggregator.
- The canvas encoder checks that the produced blob's type matches the requested MIME type and throws otherwise.

**Settings**
- AVIF output settings reuse the existing "basic + quality" settings type (the same one as JPEG/WEBP); default quality is 60, other fields use the usual resize defaults.
- The output settings panel renders the quality slider for AVIF alongside JPEG and WEBP.

**Persisted state**
- On rehydration of conversion settings, persisted output settings are merged with the initial output settings at the format key level: formats missing from persisted state get their defaults; formats present in persisted state are kept as is (no deep merge).
- The persisted-state version is not bumped. Bumping remains the tool for incompatible shape changes, including changes to fields inside a format's settings.

**Concurrency and fallback**
- The output format registry entry gains two optional fields: maximum concurrency and a main-thread fallback flag (allowed by default).
- The worker pool accepts its size as a constructor argument instead of always using `hardwareConcurrency - 1`.
- The converter, which is created per conversion with a known target, sizes the pool as the minimum of `hardwareConcurrency - 1` (at least 1) and the target format's maximum concurrency.
- When a worker fails and the target format disallows main-thread fallback, the file is reported as failed; no main-thread retry happens.
- AVIF: maximum concurrency 2, main-thread fallback disabled.

**Build**
- Vite must correctly bundle the jsquash WASM inside the ES-module worker in both dev and production builds; excluding the package from dependency pre-bundling may be needed. This has to be verified during implementation.

**SEO**
- AVIF is added to the page `description` and `keywords`. The `<title>` stays unchanged.

**Delivery** — eight commits on the `avif-format` branch, each passing typecheck and lint:
1. Sort imports in the file element component (pre-existing working-tree change).
2. Rename the native decoder.
3. Extension-based MIME resolution, extensions table, `accept`, generated formats line, removal of the HEIC helper.
4. Merge persisted output settings with defaults by format key.
5. Per-format worker concurrency and main-thread fallback flags, sized worker pool.
6. Reject silent fallback in the canvas encoder.
7. AVIF input (MIME, format lists, decoder registration, color).
8. AVIF output (dependency, encoder, settings, settings UI, registry flags, build config if needed, SEO meta).

## Out of Scope

- Multi-frame decoding of animated AVIF and animated WEBP via WebCodecs `ImageDecoder` (planned as a separate task).
- WASM fallback decoder for AVIF in browsers without native support.
- Multi-threaded AVIF encoding and the COOP/COEP headers it requires.
- Exposing AVIF encoder options beyond quality (speed, lossless, chroma subsampling, bit depth, tune, separate alpha quality).
- Animated AVIF output and merging multiple images into one AVIF.
- Preserving HDR / high bit depth: images go through the 8-bit sRGB canvas.
- Disabling main-thread fallback for the HEIC decoder or other existing formats (possible follow-up using the new flag).
- Changing the page `<title>`.
- Other new formats (e.g. JPEG XL), although the extensions table and the merge-on-rehydrate logic are meant to make them easy to add.

## Further Notes

- AVIF quality is not comparable to JPEG quality: AVIF q60 looks roughly like JPEG q75–80 at a much smaller size. That's why the default is 60, not the 75 used for JPEG/WEBP.
- AVIF encoding is much slower than canvas encoders: seconds per 12 MP photo at speed 6. If users find it too slow, a speed setting can be added later.
- Memory estimate behind the concurrency limit: a 12 MP image is ~48 MB of RGBA plus aom's internal buffers, a peak of hundreds of MB per encode. Unbounded pools (15 workers on a 16-core machine) could reach several GB.
- The output file extension comes from the blob's MIME type, so the new blob-type check in the canvas encoder also protects downloaded file names from being silently wrong.
- Because the `accept` attribute now filters the picker, the extensions table must be complete; any missing variant becomes invisible in the dialog.
