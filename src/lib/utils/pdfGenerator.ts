import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export async function generatePdf(elementId: string, fileName: string = 'payslip.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // Optimizing PDF size: Using toJpeg with 0.8 quality and 2.0 pixelRatio
        const dataUrl = await toJpeg(element, {
            quality: 0.8,
            backgroundColor: '#ffffff',
            pixelRatio: 2.0 // High enough for print, low enough for size
        });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'legal',
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

