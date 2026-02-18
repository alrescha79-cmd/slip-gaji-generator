import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import type { PaperSize } from '../types';

export async function generatePdf(elementId: string, fileName: string = 'payslip.pdf', paperSize: PaperSize = 'A4') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // Optimizing PDF size
        const dataUrl = await toJpeg(element, {
            quality: 0.95,
            backgroundColor: '#ffffff',
            pixelRatio: 3.5, // High resolution for clear text
            style: {
                transform: 'none',
                margin: '0',
                left: '0',
                top: '0',
                boxShadow: 'none',
                filter: 'none'
            }
        });

        // Map paper size to jsPDF format
        let format: string | [number, number] = paperSize.toLowerCase();
        if (paperSize === 'F4') {
            format = [215, 330]; // Indonesian F4
        } else if (paperSize === 'Legal') {
            format = 'legal';
        } else {
            format = 'a4';
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: format,
            compress: true
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

