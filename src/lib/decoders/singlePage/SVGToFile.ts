import { MIMETypes, OutputFileFormatsNames } from '../../../types/types';
import { encode } from '../../encode';
import { getScaledSVGDimensions } from '../../utils/getScaledSVGDimensions';

export const SVGToFile = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob> => {
  let svgBlobURL = blobURL;

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

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
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = svgBlobURL;

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas.width = currentWidth;
        canvas.height = currentHeight;

        // If active output format don't hold transparecy
        if (
          activeTargetFormatName !== OutputFileFormatsNames.PNG &&
          activeTargetFormatName !== OutputFileFormatsNames.TIFF &&
          activeTargetFormatName !== OutputFileFormatsNames.WEBP
        ) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Apply smoothing preset
        if (!smoothing) {
          ctx.imageSmoothingEnabled = false;
        } else {
          ctx.imageSmoothingQuality = smoothing as ImageSmoothingQuality;
        }

        ctx.drawImage(img, 0, 0);

        // If SVG was resized
        if (svgBlobURL !== blobURL) {
          URL.revokeObjectURL(svgBlobURL);
        }

        const encoded = await encode(canvas, targetFormatSettings, activeTargetFormatName);

        resolve(encoded);
      } catch (err) {
        reject(err);
      }
    };
    // If image not valid
    img.onerror = () => {
      reject(new Error('Error while parsing image'));
    };
  });
};

export default SVGToFile;
