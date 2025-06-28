// // // import React, { useEffect, useRef } from "react";
// // // import { pdfjs } from "react-pdf";
// // // import "fabric";
// // // import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // // const PDFEditor = ({ pdfUrl }) => {
// // //   const canvasRef = useRef(null);

// // //   useEffect(() => {
// // //     const loadPDF = async () => { 
// // //       const loadingTask = pdfjs.getDocument({ url: pdfUrl });
// // //       const pdf = await loadingTask.promise;
// // //       const page = await pdf.getPage(1);
// // //       const viewport = page.getViewport({ scale: 1.5 });

// // //       const canvas = canvasRef.current;
// // //       const context = canvas.getContext("2d");
// // //       canvas.width = viewport.width;
// // //       canvas.height = viewport.height;

// // //       const renderContext = {
// // //         canvasContext: context,
// // //         viewport: viewport,
// // //       };
// // //       await page.render(renderContext).promise;

// // //       // Overlay with Fabric.js
// // //       const fabricCanvas = new fabric.Canvas(canvas, {
// // //         selection: true,
// // //       });

// // //       fabricCanvas.add(
// // //         new fabric.Text("Edit Me!", {
// // //           left: 100,
// // //           top: 100,
// // //           fill: "red",
// // //           fontSize: 24,
// // //         })
// // //       );
// // //     };

// // //     loadPDF();
// // //   }, [pdfUrl]);

// // //   return (
// // //     <div className="p-4">
// // //       <canvas ref={canvasRef} className="border shadow" />
// // //     </div>
// // //   );
// // // };

// // // export default PDFEditor;

// // import React, { useRef, useEffect, useState } from "react";
// // import { pdfjs } from "react-pdf";
// // // import fabric from "fabric";
// // // import "react-pdf/dist/Page/AnnotationLayer.css";
// // // import "react-pdf/dist/Page/TextLayer.css";

// // // Setup pdfjs worker
// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // const PdfEditorTest = () => {
// //   const canvasRef = useRef(null);
// //   const [file, setFile] = useState(null);

// //   useEffect(() => {
// //     if (file) loadPDF();
// //   }, [file]);

// //   useEffect(() => {
// //     const canvas = new window.fabric.Canvas(canvasRef.current);
// //     // your canvas logic...
// //     }, []);

// //   const loadPDF = async () => {
// //     try {
// //       const fileURL = URL.createObjectURL(file);
// //       const loadingTask = pdfjs.getDocument({ url: fileURL });
// //       const pdf = await loadingTask.promise;
// //       const page = await pdf.getPage(1);
// //       const scale = 1.5;
// //       const viewport = page.getViewport({ scale });

// //       const canvas = canvasRef.current;
// //       const context = canvas.getContext("2d");
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render the PDF page
// //       await page.render({ canvasContext: context, viewport }).promise;

// //       // Use Fabric.js on the same canvas
// //       const fabricCanvas = new fabric.Canvas(canvas, {
// //         selection: true,
// //         preserveObjectStacking: true,
// //       });

// //       // Add a sample text annotation
// //       fabricCanvas.add(new fabric.Textbox("Edit me", {
// //         left: 100,
// //         top: 100,
// //         fill: "red",
// //         fontSize: 20,
// //         width: 200
// //       }));

// //       // Optional: expose globally for debugging
// //       window.fabricCanvas = fabricCanvas;

// //     } catch (err) {
// //       console.error("Failed to render PDF:", err);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <h2 className="text-2xl font-semibold mb-4">PDF Editor Test</h2>
// //       <input
// //         type="file"
// //         accept="application/pdf"
// //         onChange={(e) => setFile(e.target.files[0])}
// //         className="mb-4"
// //       />
// //       <canvas ref={canvasRef} className="border rounded shadow" />
// //     </div>
// //   );
// // };

// // export default PdfEditorTest;

// import React, { useRef, useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// // import "react-pdf/dist/Page/TextLayer.css";
// // import "react-pdf/dist/Page/AnnotationLayer.css";

// // Setup PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const PdfEditor = () => {
//   const [file, setFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const canvasRefs = useRef({});

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//       setNumPages(null);
//       canvasRefs.current = {};
//     } else {
//       alert("Please select a valid PDF file.");
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   useEffect(() => {
//     if (!numPages) return;

//     for (let page = 1; page <= numPages; page++) {
//       const ref = canvasRefs.current[page];
//       if (ref && !ref.fabricInitialized && window.fabric) {
//         const canvas = new window.fabric.Canvas(ref);
//         canvas.setWidth(612);
//         canvas.setHeight(792);
//         canvas.setBackgroundColor("transparent", canvas.renderAll.bind(canvas));
//         ref.fabricInitialized = true;
//       }
//     }
//   }, [numPages]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-2xl font-semibold mb-4">PDF Upload + Editor</h1>

//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={handleFileChange}
//         className="mb-6"
//       />

//       {file && (
//         <Document
//           file={file}
//           onLoadSuccess={onDocumentLoadSuccess}
//           loading={<p>Loading PDF...</p>}
//         >
//           {Array.from({ length: numPages || 0 }, (_, index) => {
//             const pageNumber = index + 1;
//             return (
//               <div key={pageNumber} className="relative mb-8">
//                 <Page
//                   pageNumber={pageNumber}
//                   width={612}
//                   renderAnnotationLayer={false}
//                   renderTextLayer={false}
//                 />
//                 <canvas
//                   ref={(el) => (canvasRefs.current[pageNumber] = el)}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     border: "1px dashed gray",
//                     pointerEvents: "auto",
//                     zIndex: 10,
//                   }}
//                 />
//               </div>
//             );
//           })}
//         </Document>
//       )}
//     </div>
//   );
// };

// export default PdfEditor;

// PdfEditor.jsx
import React, { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const PdfEditor = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [editedPdfBlob, setEditedPdfBlob] = useState(null);
  const [text, setText] = useState("Custom Text");
  const [x, setX] = useState(50);
  const [y, setY] = useState(700);
  const iframeRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const editedBlob = await editPDF(arrayBuffer);
      setEditedPdfBlob(editedBlob);
      const blobUrl = URL.createObjectURL(editedBlob);
      setPdfUrl(blobUrl);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const editPDF = async (arrayBuffer) => {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    firstPage.drawText(text, {
      x: Number(x),
      y: Number(y),
      size: 18,
      font,
      color: rgb(0, 0, 0.8),
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  };

  const downloadPDF = () => {
    if (editedPdfBlob) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(editedPdfBlob);
      a.download = "edited.pdf";
      a.click();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Upload & Edit PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} className="mb-2" />

      <div className="flex flex-col gap-2">
        <label className="text-sm">Text to Add</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <label className="text-sm">X Position</label>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <label className="text-sm">Y Position</label>
        <input
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={downloadPDF} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          📥 Download Edited PDF
        </button>
      </div>

      {pdfUrl && (
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          title="Edited PDF Preview"
          className="w-full h-[600px] border"
        />
      )}
    </div>
  );
};

export default PdfEditor;
