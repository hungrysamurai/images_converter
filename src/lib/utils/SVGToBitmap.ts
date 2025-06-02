import { MIMETypes } from '../../types/types';
import { getScaledSVGDimensions } from './getScaledSVGDimensions';

export default async function SVGToBitmap(
  blobURL: string,
  outputSettings: OutputConversionSettings,
): Promise<ImageBitmap> {
  let svgBlobURL;

  const { resize, units, targetHeight, targetWidth } = outputSettings;

  // Parse SVG
  const file = await fetch(blobURL);
  const svgText = await file.text();

  const svgEl = new DOMParser().parseFromString(svgText, MIMETypes.SVG)
    .documentElement as unknown as SVGSVGElement;

  // Figuring out dimensions of given SVG
  let currentWidth, currentHeight;

  const widthAttribute = svgEl.getAttribute('width');
  const heightAttribute = svgEl.getAttribute('height');

  if (widthAttribute) {
    currentWidth = parseInt(widthAttribute);
  }

  if (heightAttribute) {
    currentHeight = parseInt(heightAttribute);
  }

  if (!currentWidth || !currentHeight) {
    // Trying to get viewBox...
    const viewBox = svgEl.getAttribute('viewBox');

    if (viewBox) {
      const viewBoxValues = viewBox.split(' ');
      const viewBoxWidth = viewBoxValues[2];
      const viewBoxHeight = viewBoxValues[3];

      currentWidth = Number(viewBoxWidth);
      currentHeight = Number(viewBoxHeight);
    } else {
      // If viewBox missing & there is no width-height - just place svg in DOM and get width and height
      document.body.appendChild(svgEl);

      if (svgEl.isConnected) {
        const bbox = svgEl.getBBox();

        currentWidth = Math.round(bbox.width);
        currentHeight = Math.round(bbox.height);
      }

      svgEl.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);

      // Cleanup
      document.body.removeChild(svgEl);
    }
  }

  if (
    !currentWidth ||
    !currentHeight ||
    typeof currentHeight !== 'number' ||
    typeof currentWidth !== 'number'
  ) {
    throw new Error('Failed to load SVG dimensions!');
  }

  if (resize && (targetWidth || targetHeight)) {
    // Scale SVG
    const targetDimensions = getScaledSVGDimensions(
      currentHeight,
      currentWidth,
      units,
      targetWidth,
      targetHeight,
    );

    svgEl.setAttribute('width', targetDimensions.width);
    svgEl.setAttribute('height', targetDimensions.height);

    currentWidth = parseInt(targetDimensions.width);
    currentHeight = parseInt(targetDimensions.height);

    // Convert SVG element to a data URL
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });

    svgBlobURL = URL.createObjectURL(svgBlob);
  } else {
    svgEl.setAttribute('width', `${currentWidth}`);
    svgEl.setAttribute('height', `${currentHeight}`);

    // Convert SVG element to a data URL
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });

    svgBlobURL = URL.createObjectURL(svgBlob);
  }

  const img = new Image();
  img.src = svgBlobURL;
  await img.decode();

  const bmp = await createImageBitmap(img, 0, 0, currentWidth, currentHeight, {
    resizeHeight: currentHeight,
    resizeWidth: currentWidth,
  });

  // If SVG was resized
  if (svgBlobURL !== blobURL) {
    URL.revokeObjectURL(svgBlobURL);
  }
  return bmp;
}
