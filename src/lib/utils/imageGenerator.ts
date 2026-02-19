import { toPng, toJpeg } from 'html-to-image';

export async function generateImage(
    elementId: string,
    fileName: string = 'payslip.png',
    format: 'png' | 'jpeg' = 'png'
) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        const pages = container.querySelectorAll('.payslip-page');
        const elementsToCapture = pages.length > 0 ? Array.from(pages) : [container];

        for (let i = 0; i < elementsToCapture.length; i++) {
            const el = elementsToCapture[i] as HTMLElement;

            // For multiple pages, we append the page number to the filename
            const currentFileName = elementsToCapture.length > 1
                ? fileName.replace(/(\.[\w]+)$/, `_page_${i + 1}$1`)
                : fileName;

            const options = {
                quality: 0.95,
                backgroundColor: '#ffffff',
                pixelRatio: 2, // Double resolution for clarity
            };

            const dataUrl = format === 'png'
                ? await toPng(el, options)
                : await toJpeg(el, options);

            const link = document.createElement('a');
            link.download = currentFileName;
            link.href = dataUrl;
            link.click();
        }
    } catch (error) {
        console.error('Error generating image:', error);
    }
}
