import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Converts OKLCH lightness, chroma, hue, and alpha to standard sRGB rgb() or rgba() string
 */
export function oklchToRgb(l: number, c: number, h: number, a = 1): string {
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const rLin = +4.0767434070 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const toRgbInt = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    const srgb = clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(srgb * 255);
  };

  const r = toRgbInt(rLin);
  const g = toRgbInt(gLin);
  const b = toRgbInt(bLin);

  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Parses any oklch(...) token into standard sRGB rgb() or rgba() string
 */
export function parseAndConvertOklch(str: string): string {
  try {
    const match = str.match(/oklch\s*\(\s*([^)]+)\s*\)/i);
    if (!match) return '#334155';

    const content = match[1].trim();
    const [colorPart, alphaPart] = content.split('/');
    const tokens = colorPart.trim().split(/[\s,]+/).filter(Boolean);
    if (tokens.length < 3) {
      if (content.includes('1 0') || content.includes('100% 0')) return '#ffffff';
      if (content.includes('0 0') || content.includes('0% 0')) return '#000000';
      return '#334155';
    }

    let L = tokens[0].endsWith('%') ? parseFloat(tokens[0]) / 100 : parseFloat(tokens[0]);
    let C = tokens[1].endsWith('%') ? (parseFloat(tokens[1]) / 100) * 0.4 : parseFloat(tokens[1]);
    let h = tokens[2].endsWith('deg') ? parseFloat(tokens[2]) : parseFloat(tokens[2]);
    if (tokens[2].endsWith('rad')) h = (parseFloat(tokens[2]) * 180) / Math.PI;
    if (tokens[2].endsWith('turn')) h = parseFloat(tokens[2]) * 360;

    let A = 1;
    if (alphaPart) {
      const aClean = alphaPart.trim();
      A = aClean.endsWith('%') ? parseFloat(aClean) / 100 : parseFloat(aClean);
      if (isNaN(A)) A = 1;
      A = Math.max(0, Math.min(1, A));
    }

    if (isNaN(L)) L = 0.5;
    if (isNaN(C)) C = 0;
    if (isNaN(h)) h = 0;

    return oklchToRgb(L, C, h, A);
  } catch {
    return '#334155';
  }
}

/**
 * Sanitizes all oklch and modern CSS color functions from a string
 */
export function sanitizeAllModernColors(input: string): string {
  if (!input) return input;
  let res = input;

  if (res.includes('oklch')) {
    res = res.replace(/oklch\s*\([^)]+\)/gi, (m) => parseAndConvertOklch(m));
  }
  if (res.includes('color-mix')) {
    res = res.replace(/color-mix\([^)]+\)/gi, '#94a3b8');
  }
  if (res.includes('light-dark')) {
    res = res.replace(/light-dark\(\s*([^,]+)\s*,[^)]+\)/gi, '$1');
  }

  return res;
}

export const convertOklchToRgb = sanitizeAllModernColors;

/**
 * Sanitizes the cloned document during html2canvas onclone to remove OKLCH and unconstrain overflows
 */
function sanitizeClonedDocForPdf(clonedDoc: Document, targetElement: HTMLElement) {
  // 1. Sanitize all style tags
  clonedDoc.querySelectorAll('style').forEach((styleTag) => {
    if (styleTag.textContent && (styleTag.textContent.includes('oklch') || styleTag.textContent.includes('color-mix'))) {
      styleTag.textContent = sanitizeAllModernColors(styleTag.textContent);
    }
  });

  // 2. Remove external stylesheets to prevent re-parsing modern tokens
  clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    try { link.remove(); } catch { /* Ignore */ }
  });

  // 3. Clear adoptedStyleSheets if present
  try {
    if ((clonedDoc as unknown as { adoptedStyleSheets?: unknown[] }).adoptedStyleSheets) {
      (clonedDoc as unknown as { adoptedStyleSheets: unknown[] }).adoptedStyleSheets = [];
    }
  } catch { /* Ignore */ }

  // 4. IMPORTANT: Unconstrain overflow on all ancestors so content is NEVER clipped by modal scroll
  let parentNode: HTMLElement | null = targetElement;
  while (parentNode && parentNode !== clonedDoc.body) {
    parentNode.style.overflow = 'visible';
    parentNode.style.height = 'auto';
    parentNode.style.maxHeight = 'none';
    parentNode = parentNode.parentElement;
  }
  if (clonedDoc.body) {
    clonedDoc.body.style.overflow = 'visible';
    clonedDoc.body.style.height = 'auto';
    clonedDoc.body.style.backgroundColor = '#ffffff';
    clonedDoc.body.style.color = '#0f172a';
  }
  if (clonedDoc.documentElement) {
    clonedDoc.documentElement.style.overflow = 'visible';
    clonedDoc.documentElement.style.height = 'auto';
  }

  // 5. Inject safe baseline print CSS
  const printBaseline = clonedDoc.createElement('style');
  printBaseline.textContent = `
    *, *::before, *::after {
      box-sizing: border-box;
      --tw-ring-color: rgba(59, 130, 246, 0.5) !important;
      --tw-ring-offset-color: #ffffff !important;
      --tw-shadow-color: rgba(0, 0, 0, 0.05) !important;
      --tw-border-color: #cbd5e1 !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      color: #0f172a !important;
      background-color: #ffffff !important;
    }
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }
    th, td {
      border-color: #cbd5e1 !important;
      color: #0f172a !important;
    }
    .a4-page, .a4-page-sheet {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: 297mm !important;
      box-shadow: none !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
      border: none !important;
    }
  `;
  clonedDoc.head.appendChild(printBaseline);

  // 6. Walk every node to sanitize inline and computed styles
  const win = clonedDoc.defaultView || window;
  const allElements = [
    clonedDoc.documentElement,
    clonedDoc.body,
    targetElement,
    ...Array.from(clonedDoc.querySelectorAll('*'))
  ];

  const colorProperties = [
    'color', 'background-color', 'border-color', 'border-top-color',
    'border-right-color', 'border-bottom-color', 'border-left-color',
    'outline-color', 'text-decoration-color', 'box-shadow', 'caret-color',
    'accent-color', 'fill', 'stroke'
  ];

  allElements.forEach((node) => {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) return;
    const inlineStyle = node.getAttribute('style');
    if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('color-mix'))) {
      node.setAttribute('style', sanitizeAllModernColors(inlineStyle));
    }

    try {
      const computed = win.getComputedStyle(node);
      colorProperties.forEach((prop) => {
        const val = computed.getPropertyValue(prop);
        if (val && (val.includes('oklch') || val.includes('color-mix'))) {
          if (prop === 'box-shadow') {
            node.style.setProperty(prop, 'none', 'important');
          } else {
            node.style.setProperty(prop, sanitizeAllModernColors(val), 'important');
          }
        }
      });
    } catch { /* Ignore */ }
  });
}

/**
 * Exports an HTML DOM element to a standard A4 portrait PDF (210 x 297 mm)
 * Guarantees zero cutting off by supporting dedicated A4 sheets and unconstrained canvas rendering
 */
export const exportElementToA4Pdf = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Check if the container defines explicit .a4-page-sheet elements (e.g. Halaman 1 & Halaman 2)
    const sheets = Array.from(element.querySelectorAll<HTMLElement>('.a4-page-sheet'));
    const targets = sheets.length > 0 ? sheets : [element];

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        windowHeight: Math.max(target.scrollHeight, 1200),
        onclone: (clonedDoc, clonedElement) => {
          sanitizeClonedDocForPdf(clonedDoc, clonedElement);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const imgHeightInMm = (canvas.height * pageWidth) / canvas.width;

      if (imgHeightInMm <= pageHeight) {
        // Fits on single A4 page
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeightInMm);
      } else if (imgHeightInMm <= pageHeight + 20) {
        // Fits when proportionally scaled to A4 page height (guarantees zero cutoff)
        const scaleFactor = pageHeight / imgHeightInMm;
        const scaledWidth = pageWidth * scaleFactor;
        const offsetX = (pageWidth - scaledWidth) / 2;
        pdf.addImage(imgData, 'JPEG', offsetX, 0, scaledWidth, pageHeight);
      } else {
        // If an individual target exceeds standard A4 significantly, perform clean canvas slicing
        const pageCanvasWidth = canvas.width;
        const pageCanvasHeight = Math.floor((pageHeight / pageWidth) * pageCanvasWidth);
        let currentSourceY = 0;
        let subPageIndex = 0;

        while (currentSourceY < canvas.height) {
          if (subPageIndex > 0) {
            pdf.addPage('a4', 'portrait');
          }

          const sliceHeight = Math.min(pageCanvasHeight, canvas.height - currentSourceY);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = pageCanvasWidth;
          sliceCanvas.height = sliceHeight;
          const sliceCtx = sliceCanvas.getContext('2d');

          if (sliceCtx) {
            sliceCtx.fillStyle = '#ffffff';
            sliceCtx.fillRect(0, 0, pageCanvasWidth, sliceHeight);
            sliceCtx.drawImage(
              canvas,
              0, currentSourceY, pageCanvasWidth, sliceHeight,
              0, 0, pageCanvasWidth, sliceHeight
            );

            const sliceDataUrl = sliceCanvas.toDataURL('image/jpeg', 0.98);
            const sliceHeightInMm = (sliceHeight * pageWidth) / pageCanvasWidth;
            pdf.addImage(sliceDataUrl, 'JPEG', 0, 0, pageWidth, sliceHeightInMm);
          }

          currentSourceY += sliceHeight;
          subPageIndex++;
        }
      }
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
  } catch (error) {
    console.warn('html2canvas encountered an issue, falling back to print dialog:', error);
    window.print();
  }
};
