// // import { useState, useEffect } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";
// // import ReactQuill from "react-quill";
// // import "react-quill/dist/quill.snow.css";
// // import { v4 as uuidv4 } from "uuid";
// // import axios from "axios";
// // import jsPDF from "jspdf";

// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // const ProposalEditor = ({ proposalData }) => {
// //   const [isPDF, setIsPDF] = useState(false);
// //   const [numPages, setNumPages] = useState(null);
// //   const [form, setForm] = useState({});
// //   const [fileUrl, setFileUrl] = useState("");
// //   const [versionHistory, setVersionHistory] = useState([]);

// //   useEffect(() => {
// //     if (typeof proposalData === "string" && proposalData.endsWith(".pdf")) {
// //       setIsPDF(true);
// //       setFileUrl(proposalData);
// //     } else if (typeof proposalData === "object") {
// //       setIsPDF(false);
// //       setForm(proposalData);
// //     }
// //   }, [proposalData]);

// //   useEffect(() => {
// //     const saved = localStorage.getItem("autosavedProposal");
// //     if (saved) {
// //       setForm(JSON.parse(saved));
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       localStorage.setItem("autosavedProposal", JSON.stringify(form));
// //     }, 30000);

// //     return () => clearInterval(interval);
// //   }, [form]);

// //   const handleChange = (key, value) => {
// //     setForm((prev) => ({ ...prev, [key]: value }));
// //   };

// //   const handleSubmit = () => {
// //     const version = {
// //       id: uuidv4(),
// //       timestamp: new Date().toISOString(),
// //       data: form,
// //     };
// //     setVersionHistory((prev) => [version, ...prev]);
// //     console.log("Saved Version:", version);
// //   };

// //   const handleFinalSubmit = async () => {
// //     try {
// //       const res = await axios.post(
// //         "https://proposal-form-backend.vercel.app/api/proposal/submit",
// //         { data: form },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       alert("Proposal submitted successfully!");
// //     } catch (err) {
// //       console.error("Submit Error:", err);
// //       alert("Failed to submit proposal.");
// //     }
// //   };

// //   const exportToPDF = (proposalData) => {
// //     const doc = new jsPDF({
// //       unit: "mm",
// //       format: "a4",
// //       orientation: "portrait",
// //     });

// //     const pageHeight = 297;
// //     const marginLeft = 20;
// //     const maxWidth = 170;
// //     const lineHeight = 8;
// //     let y = 20;
// //     let pageNumber = 1;

// //     const stripHtml = (html) => {
// //       const temp = document.createElement("div");
// //       temp.innerHTML = html;
// //       return temp.textContent || temp.innerText || "";
// //     };

// //     const formatLabel = (key) =>
// //       key
// //         .replace(/([A-Z])/g, " $1")
// //         .replace(/_/g, " ")
// //         .replace(/^./, (str) => str.toUpperCase());

// //     const addPageNumber = () => {
// //       doc.setFontSize(10);
// //       doc.setFont("helvetica", "italic");
// //       doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 10, {
// //         align: "center",
// //       });
// //     };

// //     // Title
// //     doc.setFontSize(18);
// //     doc.setFont("helvetica", "bold");
// //     doc.text("Proposal Document", marginLeft, y);
// //     y += 12;

// //     doc.setFontSize(12);

// //     Object.entries(proposalData).forEach(([key, raw]) => {
// //       if (y > pageHeight - 30) {
// //         addPageNumber();
// //         doc.addPage();
// //         pageNumber++;
// //         y = 20;
// //       }

// //       const label = formatLabel(key);
// //       let value = "";

// //       if (typeof raw === "string") {
// //         value = stripHtml(raw);
// //       } else if (typeof raw === "object") {
// //         value = JSON.stringify(raw, null, 2);
// //       } else {
// //         value = String(raw);
// //       }

// //       doc.setFont("helvetica", "bold");
// //       doc.text(`${label}:`, marginLeft, y);
// //       y += 6;

// //       doc.setFont("helvetica", "normal");
// //       const lines = doc.splitTextToSize(value, maxWidth);
// //       doc.text(lines, marginLeft, y);
// //       y += lines.length * lineHeight;
// //     });

// //     addPageNumber(); // Add last page number
// //     doc.save("proposal.pdf");
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();

// //     if (file.type === "application/pdf") {
// //       setIsPDF(true);
// //       reader.onloadend = () => setFileUrl(reader.result);
// //       reader.readAsDataURL(file);
// //     } else if (file.type === "application/json") {
// //       setIsPDF(false);
// //       reader.onload = () => {
// //         try {
// //           const json = JSON.parse(reader.result);
// //           setForm(json);
// //         } catch (err) {
// //           alert("Invalid JSON file");
// //         }
// //       };
// //       reader.readAsText(file);
// //     } else {
// //       alert("Unsupported file format. Upload PDF or JSON.");
// //     }
// //   };

// //   const renderJsonEditor = () => (
// //     <div
// //       id="proposal-content"
// //       className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto"
// //     >
// //       <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>
// //       {Object.entries(form).map(([key, value]) => (
// //         <div key={key}>
// //           <label className="block text-sm font-medium text-gray-700">
// //             {key}
// //           </label>
// //           {typeof value === "string" && value.length > 100 ? (
// //             <ReactQuill
// //               theme="snow"
// //               className="mt-2"
// //               value={value}
// //               onChange={(val) => handleChange(key, val)}
// //             />
// //           ) : (
// //             <input
// //               type="text"
// //               className="w-full border p-2 rounded mt-1"
// //               value={value}
// //               onChange={(e) => handleChange(key, e.target.value)}
// //             />
// //           )}
// //         </div>
// //       ))}
// //       <div className="flex gap-2">
// //         <button
// //           onClick={() => handleSubmit()}
// //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //         >
// //           Save Version
// //         </button>
// //         <button
// //           onClick={() => handleFinalSubmit()}
// //           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
// //         >
// //           Submit Proposal
// //         </button>
// //         <button
// //           onClick={() => exportToPDF(form)}
// //           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
// //         >
// //           Export to PDF
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   const renderPdfViewer = () => (
// //     <div className="flex flex-col items-center py-6">
// //       <h2 className="text-xl font-semibold mb-4">Proposal PDF Preview</h2>
// //       <Document
// //         file={fileUrl}
// //         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
// //       >
// //         {Array.from(new Array(numPages), (el, index) => (
// //           <Page key={`page_${index + 1}`} pageNumber={index + 1} />
// //         ))}
// //       </Document>
// //     </div>
// //   );

// //   const renderVersionHistory = () => (
// //     <div className="max-w-3xl mx-auto mt-6">
// //       <h3 className="text-lg font-semibold mb-2">Version History</h3>
// //       <ul className="space-y-2">
// //         {versionHistory.map((v) => (
// //           <li
// //             key={v.id}
// //             className="border p-3 rounded text-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
// //             onClick={() => setForm(v.data)}
// //           >
// //             <strong>{new Date(v.timestamp).toLocaleString()}</strong>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );

// //   return (
// //     <section className="min-h-screen bg-gray-50 py-10 px-4">
// //       <div className="mb-6 flex justify-between items-center max-w-3xl mx-auto">
// //         <input
// //           type="file"
// //           accept=".pdf,.json"
// //           onChange={handleFileUpload}
// //           className="block w-full text-sm file:px-4 file:py-2 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
// //         />
// //       </div>
// //       {isPDF ? renderPdfViewer() : renderJsonEditor()}
// //       {!isPDF && versionHistory.length > 0 && renderVersionHistory()}
// //     </section>
// //   );
// // };

// // export default ProposalEditor;

// import { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import jsPDF from "jspdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const ProposalEditor = ({ proposalData }) => {
//   const [isPDF, setIsPDF] = useState(false);
//   const [numPages, setNumPages] = useState(null);
//   const [form, setForm] = useState({});
//   const [fileUrl, setFileUrl] = useState("");
//   const [versionHistory, setVersionHistory] = useState([]);

//   useEffect(() => {
//     if (typeof proposalData === "string" && proposalData.endsWith(".pdf")) {
//       setIsPDF(true);
//       setFileUrl(proposalData);
//     } else if (typeof proposalData === "object") {
//       setIsPDF(false);
//       setForm(proposalData);
//     }
//   }, [proposalData]);

//   const handleChange = (section, key, value, index = null) => {
//     setForm((prev) => {
//       const updated = { ...prev };
//       if (index !== null) {
//         updated[section][index][key] = value;
//       } else {
//         updated[section][key] = value;
//       }
//       return updated;
//     });
//   };

//   const handleArrayChange = (section, index, key, value) => {
//     const newArray = [...form[section]];
//     newArray[index][key] = value;
//     setForm((prev) => ({ ...prev, [section]: newArray }));
//   };

//   const handleFinalSubmit = async () => {
//     try {
//       const res = await axios.post(
//         "https://proposal-form-backend.vercel.app/api/proposal/submit",
//         { data: form },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("Proposal submitted successfully!");
//     } catch (err) {
//       console.error("Submit Error:", err);
//       alert("Failed to submit proposal.");
//     }
//   };

//   const exportToPDF = (proposalData) => {
//     const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//     const pageHeight = 297;
//     const marginLeft = 20;
//     const maxWidth = 170;
//     const lineHeight = 8;
//     let y = 20;
//     let pageNumber = 1;

//     const stripHtml = (html) => {
//       const temp = document.createElement("div");
//       temp.innerHTML = html;
//       return temp.textContent || temp.innerText || "";
//     };

//     const addPageNumber = () => {
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "italic");
//       doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: "center" });
//     };

//     const printSection = (title, content) => {
//       if (y > pageHeight - 30) {
//         addPageNumber();
//         doc.addPage();
//         pageNumber++;
//         y = 20;
//       }
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(14);
//       doc.text(title, marginLeft, y);
//       y += 6;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(12);
//       const lines = doc.splitTextToSize(stripHtml(content), maxWidth);
//       doc.text(lines, marginLeft, y);
//       y += lines.length * lineHeight;
//     };

//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Proposal Document", marginLeft, y);
//     y += 12;

//     printSection("Cover Letter", form.coverLetter.body);
//     printSection("Executive Summary", form.executiveSummary.objective);
//     form.executiveSummary.keyOutcomes.forEach((item, i) => printSection(`Outcome ${i + 1}`, item));
//     form.projectPlan.forEach((p, i) => printSection(`Phase ${i + 1}: ${p.phase}`, `${p.timeline} - ${p.deliverable}`));
//     printSection("Partnership", `Budget: ${form.partnership.budgetRange}, Contact: ${form.partnership.contact}`);
//     form.references.forEach((r, i) => printSection(`Reference ${i + 1}`, `${r.project}, ${r.client}, ${r.outcome}`));

//     addPageNumber();
//     doc.save("proposal.pdf");
//   };

//   const renderStructuredEditor = () => (
//     <div id="proposal-content" className="space-y-6 bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
//       <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>

//       <div>
//         <h3 className="font-medium text-lg mb-2">Cover Letter</h3>
//         <ReactQuill value={form.coverLetter.body || ""} onChange={(val) => handleChange("coverLetter", "body", val)} />
//       </div>

//       <div>
//         <h3 className="font-medium text-lg mb-2">Executive Summary</h3>
//         <input type="text" className="w-full border p-2 rounded" value={form.executiveSummary.objective} onChange={(e) => handleChange("executiveSummary", "objective", e.target.value)} />
//         {form.executiveSummary.keyOutcomes.map((outcome, i) => (
//           <input key={i} type="text" className="w-full border p-2 rounded mt-2" value={outcome} onChange={(e) => {
//             const updated = [...form.executiveSummary.keyOutcomes];
//             updated[i] = e.target.value;
//             setForm((prev) => ({ ...prev, executiveSummary: { ...prev.executiveSummary, keyOutcomes: updated } }));
//           }} />
//         ))}
//       </div>

//       <div>
//         <h3 className="font-medium text-lg mb-2">Project Plan</h3>
//         {form.projectPlan.map((phase, i) => (
//           <div key={i} className="mb-4">
//             <input type="text" placeholder="Phase" className="w-full border p-2 rounded mb-1" value={phase.phase} onChange={(e) => handleArrayChange("projectPlan", i, "phase", e.target.value)} />
//             <input type="text" placeholder="Timeline" className="w-full border p-2 rounded mb-1" value={phase.timeline} onChange={(e) => handleArrayChange("projectPlan", i, "timeline", e.target.value)} />
//             <input type="text" placeholder="Deliverable" className="w-full border p-2 rounded" value={phase.deliverable} onChange={(e) => handleArrayChange("projectPlan", i, "deliverable", e.target.value)} />
//           </div>
//         ))}
//       </div>

//       <div>
//         <h3 className="font-medium text-lg mb-2">Partnership & Pricing</h3>
//         <input type="text" placeholder="Budget Range" className="w-full border p-2 rounded mb-2" value={form.partnership.budgetRange} onChange={(e) => handleChange("partnership", "budgetRange", e.target.value)} />
//         <input type="text" placeholder="Contact" className="w-full border p-2 rounded" value={form.partnership.contact} onChange={(e) => handleChange("partnership", "contact", e.target.value)} />
//       </div>

//       <div>
//         <h3 className="font-medium text-lg mb-2">References</h3>
//         {form.references.map((ref, i) => (
//           <div key={i} className="mb-3">
//             <input type="text" placeholder="Project" className="w-full border p-2 rounded mb-1" value={ref.project} onChange={(e) => handleArrayChange("references", i, "project", e.target.value)} />
//             <input type="text" placeholder="Client" className="w-full border p-2 rounded mb-1" value={ref.client} onChange={(e) => handleArrayChange("references", i, "client", e.target.value)} />
//             <input type="text" placeholder="Outcome" className="w-full border p-2 rounded" value={ref.outcome} onChange={(e) => handleArrayChange("references", i, "outcome", e.target.value)} />
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <button onClick={handleFinalSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Proposal</button>
//         <button onClick={() => exportToPDF(form)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Export to PDF</button>
//       </div>
//     </div>
//   );

//   return (
//     <section className="min-h-screen bg-gray-50 py-10 px-4">
//       {isPDF ? (
//         <div className="flex flex-col items-center py-6">
//           <h2 className="text-xl font-semibold mb-4">Proposal PDF Preview</h2>
//           <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
//             {Array.from(new Array(numPages), (el, index) => (
//               <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//             ))}
//           </Document>
//         </div>
//       ) : renderStructuredEditor()}
//     </section>
//   );
// };

// export default ProposalEditor;

// import { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import CustomQuillEditor from "../pages/CustomQuillEditor";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import jsPDF from "jspdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const ProposalEditor = ({ proposalData }) => {
//   const [isPDF, setIsPDF] = useState(false);
//   const [numPages, setNumPages] = useState(null);
//   const [form, setForm] = useState({});
//   const [fileUrl, setFileUrl] = useState("");
//   const [versionHistory, setVersionHistory] = useState([]);

//   useEffect(() => {
//     if (typeof proposalData === "string" && proposalData.endsWith(".pdf")) {
//       setIsPDF(true);
//       setFileUrl(proposalData);
//     } else if (typeof proposalData === "object") {
//       setIsPDF(false);
//       const fallback = {
//         coverLetter: { body: "" },
//         executiveSummary: { objective: "", keyOutcomes: [""] },
//         projectPlan: [{ phase: "", timeline: "", deliverable: "" }],
//         partnership: { budgetRange: "", contact: "" },
//         references: [{ project: "", client: "", outcome: "" }]
//       };
//       setForm({ ...fallback, ...proposalData });
//     }
//   }, [proposalData]);

//   const handleChange = (section, key, value, index = null) => {
//     setForm((prev) => {
//       const updated = { ...prev };
//       if (index !== null) {
//         updated[section][index][key] = value;
//       } else {
//         updated[section][key] = value;
//       }
//       return updated;
//     });
//   };

//   const handleArrayChange = (section, index, key, value) => {
//     const newArray = [...(form[section] || [])];
//     newArray[index][key] = value;
//     setForm((prev) => ({ ...prev, [section]: newArray }));
//   };

//   const handleSave = () => {
//     const version = {
//       id: uuidv4(),
//       timestamp: new Date().toISOString(),
//       data: form,
//     };
//     setVersionHistory((prev) => [version, ...prev]);
//     console.log("Saved Version:", version);
//   };

//   const handleFinalSubmit = async () => {
//     try {
//       const res = await axios.post(
//         "https://proposal-form-backend.vercel.app/api/proposal/submit",
//         { data: form },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("Proposal submitted successfully!");
//     } catch (err) {
//       console.error("Submit Error:", err);
//       alert("Failed to submit proposal.");
//     }
//   };

//   const exportToPDF = (proposalData) => {
//     const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//     const pageHeight = 297;
//     const marginLeft = 20;
//     const maxWidth = 170;
//     const lineHeight = 8;
//     let y = 20;
//     let pageNumber = 1;

//     const stripHtml = (html) => {
//       const temp = document.createElement("div");
//       temp.innerHTML = html;
//       return temp.textContent || temp.innerText || "";
//     };

//     const addPageNumber = () => {
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "italic");
//       doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: "center" });
//     };

//     const printSection = (title, content) => {
//       if (y > pageHeight - 30) {
//         addPageNumber();
//         doc.addPage();
//         pageNumber++;
//         y = 20;
//       }
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(14);
//       doc.text(title, marginLeft, y);
//       y += 6;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(12);
//       const lines = doc.splitTextToSize(stripHtml(content), maxWidth);
//       doc.text(lines, marginLeft, y);
//       y += lines.length * lineHeight;
//     };

//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Proposal Document", marginLeft, y);
//     y += 12;

//     printSection("Cover Letter", form.coverLetter?.body || "");
//     printSection("Executive Summary", form.executiveSummary?.objective || "");
//     (form.executiveSummary?.keyOutcomes || []).forEach((item, i) => printSection(`Outcome ${i + 1}`, item));
//     (form.projectPlan || []).forEach((p, i) => printSection(`Phase ${i + 1}: ${p.phase}`, `${p.timeline} - ${p.deliverable}`));
//     printSection("Partnership", `Budget: ${form.partnership?.budgetRange || ""}, Contact: ${form.partnership?.contact || ""}`);
//     (form.references || []).forEach((r, i) => printSection(`Reference ${i + 1}`, `${r.project}, ${r.client}, ${r.outcome}`));

//     addPageNumber();
//     doc.save("proposal.pdf");
//   };

//   // const renderStructuredEditor = () => (
//   //   <div id="proposal-content" className="space-y-6 bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
//   //     <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>

//   //     <div>
//   //       <h3 className="font-medium text-lg mb-2">Cover Letter</h3>
//   //       <CustomQuillEditor
//   //         value={form.coverLetter?.body || ""} 
//   //         onChange={(val) => handleChange("coverLetter", "body", val)}
//   //       />
//   //     </div>

//   //     <div>
//   //       <h3 className="font-medium text-lg mb-2">Executive Summary</h3>
//   //       <input type="text" className="w-full border p-2 rounded" value={form.executiveSummary?.objective || ""} onChange={(e) => handleChange("executiveSummary", "objective", e.target.value)} />
//   //       {(form.executiveSummary?.keyOutcomes || []).map((outcome, i) => (
//   //         <input key={i} type="text" className="w-full border p-2 rounded mt-2" value={outcome} onChange={(e) => {
//   //           const updated = [...form.executiveSummary.keyOutcomes];
//   //           updated[i] = e.target.value;
//   //           setForm((prev) => ({ ...prev, executiveSummary: { ...prev.executiveSummary, keyOutcomes: updated } }));
//   //         }} />
//   //       ))}
//   //     </div>

//   //     <div>
//   //       <h3 className="font-medium text-lg mb-2">Project Plan</h3>
//   //       {(form.projectPlan || []).map((phase, i) => (
//   //         <div key={i} className="mb-4">
//   //           <input type="text" placeholder="Phase" className="w-full border p-2 rounded mb-1" value={phase.phase} onChange={(e) => handleArrayChange("projectPlan", i, "phase", e.target.value)} />
//   //           <input type="text" placeholder="Timeline" className="w-full border p-2 rounded mb-1" value={phase.timeline} onChange={(e) => handleArrayChange("projectPlan", i, "timeline", e.target.value)} />
//   //           <input type="text" placeholder="Deliverable" className="w-full border p-2 rounded" value={phase.deliverable} onChange={(e) => handleArrayChange("projectPlan", i, "deliverable", e.target.value)} />
//   //         </div>
//   //       ))}
//   //     </div>

//   //     <div>
//   //       <h3 className="font-medium text-lg mb-2">Partnership & Pricing</h3>
//   //       <input type="text" placeholder="Budget Range" className="w-full border p-2 rounded mb-2" value={form.partnership?.budgetRange || ""} onChange={(e) => handleChange("partnership", "budgetRange", e.target.value)} />
//   //       <input type="text" placeholder="Contact" className="w-full border p-2 rounded" value={form.partnership?.contact || ""} onChange={(e) => handleChange("partnership", "contact", e.target.value)} />
//   //     </div>

//   //     <div>
//   //       <h3 className="font-medium text-lg mb-2">References</h3>
//   //       {(form.references || []).map((ref, i) => (
//   //         <div key={i} className="mb-3">
//   //           <input type="text" placeholder="Project" className="w-full border p-2 rounded mb-1" value={ref.project} onChange={(e) => handleArrayChange("references", i, "project", e.target.value)} />
//   //           <input type="text" placeholder="Client" className="w-full border p-2 rounded mb-1" value={ref.client} onChange={(e) => handleArrayChange("references", i, "client", e.target.value)} />
//   //           <input type="text" placeholder="Outcome" className="w-full border p-2 rounded" value={ref.outcome} onChange={(e) => handleArrayChange("references", i, "outcome", e.target.value)} />
//   //         </div>
//   //       ))}
//   //     </div>

//   //     <div className="flex gap-2">
//   //       <button onClick={handleFinalSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Proposal</button>
//   //       <button onClick={() => exportToPDF(form)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Export to PDF</button>
//   //     </div>
//   //   </div>
//   // );

//   const renderStructuredEditor = () => (
//     <div id="proposal-content" className="space-y-6 bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
//       <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>

//       {/* Cover Letter */}
//       <div>
//         <h3 className="font-medium text-lg mb-2">Cover Letter</h3>
//         <CustomQuillEditor
//           value={form.coverLetter?.body || ""}
//           onChange={(val) => handleChange("coverLetter", "body", val)}
//         />
//       </div>

//       {/* Executive Summary */}
//       <div>
//         <h3 className="font-medium text-lg mb-2">Executive Summary - Objective</h3>
//         <CustomQuillEditor
//           value={form.executiveSummary?.objective || ""}
//           onChange={(val) => handleChange("executiveSummary", "objective", val)}
//         />
//         <h3 className="font-medium text-lg mt-4 mb-2">Key Outcomes</h3>
//         {(form.executiveSummary?.keyOutcomes || []).map((outcome, i) => (
//           <div key={i} className="mb-3">
//             <CustomQuillEditor
//               value={outcome}
//               onChange={(val) => {
//                 const updated = [...form.executiveSummary.keyOutcomes];
//                 updated[i] = val;
//                 setForm((prev) => ({
//                   ...prev,
//                   executiveSummary: {
//                     ...prev.executiveSummary,
//                     keyOutcomes: updated,
//                   },
//                 }));
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Project Plan */}
//       <div>
//         <h3 className="font-medium text-lg mb-2">Project Plan</h3>
//         {(form.projectPlan || []).map((phase, i) => (
//           <div key={i} className="mb-6 space-y-2">
//             <div>
//               <h4 className="font-semibold">Phase {i + 1} Title</h4>
//               <CustomQuillEditor
//                 value={phase.phase}
//                 onChange={(val) => handleArrayChange("projectPlan", i, "phase", val)}
//               />
//             </div>
//             <div>
//               <h4 className="font-semibold">Timeline</h4>
//               <CustomQuillEditor
//                 value={phase.timeline}
//                 onChange={(val) => handleArrayChange("projectPlan", i, "timeline", val)}
//               />
//             </div>
//             <div>
//               <h4 className="font-semibold">Deliverable</h4>
//               <CustomQuillEditor
//                 value={phase.deliverable}
//                 onChange={(val) => handleArrayChange("projectPlan", i, "deliverable", val)}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Partnership */}
//       <div>
//         <h3 className="font-medium text-lg mb-2">Partnership & Pricing</h3>
//         <div className="mb-3">
//           <h4 className="font-semibold">Budget Range</h4>
//           <CustomQuillEditor
//             value={form.partnership?.budgetRange || ""}
//             onChange={(val) => handleChange("partnership", "budgetRange", val)}
//           />
//         </div>
//         <div>
//           <h4 className="font-semibold">Contact</h4>
//           <CustomQuillEditor
//             value={form.partnership?.contact || ""}
//             onChange={(val) => handleChange("partnership", "contact", val)}
//           />
//         </div>
//       </div>

//       {/* References */}
//       <div>
//         <h3 className="font-medium text-lg mb-2">References</h3>
//         {(form.references || []).map((ref, i) => (
//           <div key={i} className="mb-4 space-y-2">
//             <div>
//               <h4 className="font-semibold">Project</h4>
//               <CustomQuillEditor
//                 value={ref.project}
//                 onChange={(val) => handleArrayChange("references", i, "project", val)}
//               />
//             </div>
//             <div>
//               <h4 className="font-semibold">Client</h4>
//               <CustomQuillEditor
//                 value={ref.client}
//                 onChange={(val) => handleArrayChange("references", i, "client", val)}
//               />
//             </div>
//             <div>
//               <h4 className="font-semibold">Outcome</h4>
//               <CustomQuillEditor
//                 value={ref.outcome}
//                 onChange={(val) => handleArrayChange("references", i, "outcome", val)}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-3 mt-6">
//         <button
//           onClick={handleSave}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           💾 Save Version
//         </button>
//         <button
//           onClick={handleFinalSubmit}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           🚀 Submit Proposal
//         </button>
//         <button
//           onClick={() => exportToPDF(form)}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           📄 Export to PDF
//         </button>
//       </div>
//     </div>
//   );

//   const renderVersionHistory = () => (
//     <div className="max-w-3xl mx-auto mt-6">
//       <h3 className="text-lg font-semibold mb-2">Version History</h3>
//       <ul className="space-y-2">
//         {versionHistory.map((v) => (
//           <li
//             key={v.id}
//             className="border p-3 rounded text-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
//             onClick={() => setForm(v.data)}
//           >
//             <strong>{new Date(v.timestamp).toLocaleString()}</strong>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

//   return (
//     <section className="min-h-screen bg-gray-50 py-10 px-4">
//       {isPDF ? (
//         <div className="flex flex-col items-center py-6">
//           <h2 className="text-xl font-semibold mb-4">Proposal PDF Preview</h2>
//           <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
//             {Array.from(new Array(numPages), (el, index) => (
//               <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//             ))}
//           </Document>
//         </div>
//       ) : renderStructuredEditor()}
//       {!isPDF && versionHistory.length > 0 && renderVersionHistory()}
//     </section>
//   );
// };

// export default ProposalEditor;


// Final ProposalEditor.jsx with all requested changes:
// ✅ Consistent toolbar with unique IDs
// ✅ Collapsible sections
// ✅ Add/remove Key Outcomes and Project Phases
// ✅ Delay image upload until final submit

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import CustomQuillEditor from "../pages/CustomQuillEditor";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import jsPDF from "jspdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ProposalEditor = ({ proposalData }) => {
  const [isPDF, setIsPDF] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [form, setForm] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [versionHistory, setVersionHistory] = useState([]);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    if (typeof proposalData === "string" && proposalData.endsWith(".pdf")) {
      setIsPDF(true);
      setFileUrl(proposalData);
    } else if (typeof proposalData === "object") {
      setIsPDF(false);
      const fallback = {
        coverLetter: { body: "" },
        executiveSummary: { objective: "", keyOutcomes: [""] },
        projectPlan: [{ phase: "", timeline: "", deliverable: "" }],
        partnership: { budgetRange: "", contact: "" },
        references: [{ project: "", client: "", outcome: "" }]
      };
      setForm({ ...fallback, ...proposalData });
    }
  }, [proposalData]);

  const toggleSection = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (section, key, value, index = null) => {
    setForm(prev => {
      const updated = { ...prev };
      if (index !== null) {
        updated[section][index][key] = value;
      } else {
        updated[section][key] = value;
      }
      return updated;
    });
  };

  const handleArrayChange = (section, index, key, value) => {
    const newArray = [...(form[section] || [])];
    newArray[index][key] = value;
    setForm(prev => ({ ...prev, [section]: newArray }));
  };

  const addKeyOutcome = () => {
    setForm(prev => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        keyOutcomes: [...prev.executiveSummary.keyOutcomes, ""]
      }
    }));
  };

  const removeKeyOutcome = (i) => {
    const updated = [...form.executiveSummary.keyOutcomes];
    updated.splice(i, 1);
    setForm(prev => ({
      ...prev,
      executiveSummary: {
        ...prev.executiveSummary,
        keyOutcomes: updated
      }
    }));
  };

  const addProjectPhase = () => {
    setForm(prev => ({
      ...prev,
      projectPlan: [...prev.projectPlan, { phase: "", timeline: "", deliverable: "" }]
    }));
  };

  const removeProjectPhase = (i) => {
    const updated = [...form.projectPlan];
    updated.splice(i, 1);
    setForm(prev => ({ ...prev, projectPlan: updated }));
  };

  const handleSave = () => {
    const version = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      data: form,
    };
    setVersionHistory(prev => [version, ...prev]);
  };

  const handleFinalSubmit = async () => {
    try {
      const res = await axios.post("https://proposal-form-backend.vercel.app/api/proposal/submit", { data: form }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Proposal submitted successfully!");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to submit proposal.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const maxWidth = 170, lineHeight = 8;
    let y = 20, pageNumber = 1;
    const stripHtml = (html) => {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    };
    const addPageNumber = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() / 2, 287, { align: "center" });
    };
    const printSection = (title, content) => {
      if (y > 270) { doc.addPage(); pageNumber++; y = 20; }
      doc.setFont("helvetica", "bold").setFontSize(14).text(title, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal").setFontSize(12);
      const lines = doc.splitTextToSize(stripHtml(content), maxWidth);
      doc.text(lines, 20, y);
      y += lines.length * lineHeight;
    };
    doc.setFontSize(18).setFont("helvetica", "bold").text("Proposal Document", 20, y);
    y += 12;
    printSection("Cover Letter", form.coverLetter?.body || "");
    printSection("Executive Summary", form.executiveSummary?.objective || "");
    (form.executiveSummary?.keyOutcomes || []).forEach((item, i) => printSection(`Outcome ${i + 1}`, item));
    (form.projectPlan || []).forEach((p, i) => printSection(`Phase ${i + 1}: ${p.phase}`, `${p.timeline} - ${p.deliverable}`));
    printSection("Partnership", `Budget: ${form.partnership?.budgetRange || ""}, Contact: ${form.partnership?.contact || ""}`);
    (form.references || []).forEach((r, i) => printSection(`Reference ${i + 1}`, `${r.project}, ${r.client}, ${r.outcome}`));
    addPageNumber();
    doc.save("proposal.pdf");
  };

  const renderSection = (title, key, content) => (
    <div className="border p-4 rounded bg-white">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(key)}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <span>{collapsed[key] ? "▶" : "▼"}</span>
      </div>
      {!collapsed[key] && <div className="mt-4">{content}</div>}
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      {isPDF ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Proposal PDF Preview</h2>
          <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (_, index) => <Page key={index} pageNumber={index + 1} />)}
          </Document>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {renderSection("Cover Letter", "coverLetter",
            <CustomQuillEditor
              value={form.coverLetter?.body || ""}
              onChange={(val) => handleChange("coverLetter", "body", val)}
            />
          )}

          {renderSection("Executive Summary", "executiveSummary",
            <>
              <CustomQuillEditor
                value={form.executiveSummary?.objective || ""}
                onChange={(val) => handleChange("executiveSummary", "objective", val)}
              />
              <div className="mt-4 space-y-3">
                {(form.executiveSummary?.keyOutcomes || []).map((outcome, i) => (
                  <div key={i} className="relative">
                    <CustomQuillEditor value={outcome} onChange={(val) => {
                      const updated = [...form.executiveSummary.keyOutcomes];
                      updated[i] = val;
                      setForm(prev => ({
                        ...prev,
                        executiveSummary: { ...prev.executiveSummary, keyOutcomes: updated },
                      }));
                    }} />
                    <button onClick={() => removeKeyOutcome(i)} className="absolute top-1 right-1 text-red-600">❌</button>
                  </div>
                ))}
                <button onClick={addKeyOutcome} className="mt-2 text-sm text-blue-600">➕ Add Outcome</button>
              </div>
            </>
          )}

          {renderSection("Project Plan", "projectPlan",
            <>
              {(form.projectPlan || []).map((phase, i) => (
                <div key={i} className="border p-3 rounded mb-4 relative">
                  <CustomQuillEditor value={phase.phase} onChange={(val) => handleArrayChange("projectPlan", i, "phase", val)} />
                  <CustomQuillEditor value={phase.timeline} onChange={(val) => handleArrayChange("projectPlan", i, "timeline", val)} />
                  <CustomQuillEditor value={phase.deliverable} onChange={(val) => handleArrayChange("projectPlan", i, "deliverable", val)} />
                  <button onClick={() => removeProjectPhase(i)} className="absolute top-1 right-1 text-red-600">❌</button>
                </div>
              ))}
              <button onClick={addProjectPhase} className="text-sm text-blue-600">➕ Add Phase</button>
            </>
          )}

          {renderSection("Partnership & Pricing", "partnership",
            <>
              <CustomQuillEditor value={form.partnership?.budgetRange || ""} onChange={(val) => handleChange("partnership", "budgetRange", val)} />
              <CustomQuillEditor value={form.partnership?.contact || ""} onChange={(val) => handleChange("partnership", "contact", val)} />
            </>
          )}

          {renderSection("References", "references",
            <>
              {(form.references || []).map((ref, i) => (
                <div key={i} className="space-y-2">
                  <CustomQuillEditor value={ref.project} onChange={(val) => handleArrayChange("references", i, "project", val)} />
                  <CustomQuillEditor value={ref.client} onChange={(val) => handleArrayChange("references", i, "client", val)} />
                  <CustomQuillEditor value={ref.outcome} onChange={(val) => handleArrayChange("references", i, "outcome", val)} />
                </div>
              ))}
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">💾 Save Version</button>
            <button onClick={handleFinalSubmit} className="bg-green-600 text-white px-4 py-2 rounded">🚀 Submit Proposal</button>
            <button onClick={exportToPDF} className="bg-gray-700 text-white px-4 py-2 rounded">📄 Export to PDF</button>
          </div>

          {versionHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Version History</h3>
              <ul className="space-y-2">
                {versionHistory.map((v) => (
                  <li key={v.id} onClick={() => setForm(v.data)} className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200">
                    {new Date(v.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProposalEditor;
