import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import type { PaperSize } from '../types';

export async function generatePdf(elementId: string, fileName: string = 'payslip.pdf', paperSize: PaperSize = 'A4', orientation: 'portrait' | 'landscape' = 'portrait') {
    const container = document.getElementById(elementId);
    if (!container) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }
    try {
        let pdfFormat: string | [number, number] = paperSize.toLowerCase();
        let widthMm = 210;
        let heightMm = 297;

        if (paperSize === 'F4') {
            widthMm = 215;
            heightMm = 330;
            pdfFormat = [215, 330];
        } else if (paperSize === 'Legal') {
            widthMm = 216;
            heightMm = 356;
            pdfFormat = 'legal';
        }

        if (orientation === 'landscape') {
            const temp = widthMm;
            widthMm = heightMm;
            heightMm = temp;
        }

        // 1mm = 3.78px approximately
        const scale = 4; // Higher scale for better quality
        const pixelWidth = Math.floor(widthMm * 3.78 * scale);
        const pixelHeight = Math.floor(heightMm * 3.78 * scale);

        const pages = container.querySelectorAll('.payslip-page');
        const elementsToCapture = pages.length > 0 ? Array.from(pages) : [container];

        let pdf: jsPDF | null = null;

        for (let i = 0; i < elementsToCapture.length; i++) {
            const el = elementsToCapture[i] as HTMLElement;

            const dataUrl = await toJpeg(el, {
                quality: 0.98,
                backgroundColor: '#ffffff',
                width: pixelWidth,
                height: pixelHeight,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${widthMm}mm`,
                    height: `${heightMm}mm`,
                    margin: '0',
                    left: '0',
                    top: '0',
                    boxShadow: 'none',
                    filter: 'none'
                }
            });

            if (i === 0) {
                pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'mm',
                    format: pdfFormat,
                    compress: true
                });
            } else {
                pdf?.addPage(pdfFormat, orientation);
            }

            pdf?.addImage(dataUrl, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
        }

        pdf?.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

