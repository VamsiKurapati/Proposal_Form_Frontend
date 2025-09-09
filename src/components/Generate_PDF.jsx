import axios from 'axios';
import { shouldCompress, compressData } from '../utils/compression';

const handlePDFGeneration = async () => {
    const project = JSON.parse(localStorage.getItem('canva-project'));
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 18px;
    `;
    loadingDiv.innerHTML = 'Preparing PDF export...';
    document.body.appendChild(loadingDiv);
    try {
        console.log("Sending request to generate PDF...");
        let jsonData = null;
        let isCompressed = false;
        if (shouldCompress(project)) {
            const compressedResult = compressData(project);
            jsonData = compressedResult.compressed;
            isCompressed = true;
        } else {
            jsonData = project;
        }
        const res = await axios.post('https://proposal-form-backend.vercel.app/api/proposals/generatePDF', {
            project: jsonData,
            isCompressed
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/pdf,application/octet-stream,text/plain,application/json'
            },
        }, {
            responseType: 'arraybuffer' // Important: tell axios to expect binary data
        });

        console.log("Response data:", res.data);

        const contentType = (res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || '';

        console.log("Content type:", contentType);

        let pdfBlob;
        if (contentType.includes('application/pdf')) {
            // Server returned raw PDF bytes
            pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            console.log("PDF blob:", pdfBlob);
        } else {
            // Fallback: server returned base64 (as text) inside the ArrayBuffer
            let base64Payload = '';
            try {
                const decodedText = new TextDecoder('utf-8').decode(res.data);
                // Could be plain base64 or data URL
                base64Payload = decodedText.replace(/^data:application\/pdf;base64,/, '').trim();
                console.log("Base64 payload:", base64Payload);
            } catch (e) {
                // As a last resort, try to interpret as already-correct bytes
                pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                console.log("PDF blob:", pdfBlob);
            }

            if (!pdfBlob) {
                // Convert base64 string to Uint8Array
                const byteCharacters = atob(base64Payload);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
                console.log("PDF blob:", pdfBlob);
            }
        }

        const blobUrl = URL.createObjectURL(pdfBlob);
        console.log("Blob URL:", blobUrl);
        // Download automatically
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `proposal-${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/:/g, "-")}.pdf`;
        console.log("Link:", link);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Optional: open in new tab
        window.open(blobUrl, "_blank");

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
        console.error("PDF export error:", err);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
    }
};

export default handlePDFGeneration;