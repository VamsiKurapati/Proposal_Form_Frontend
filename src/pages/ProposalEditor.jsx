import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ProposalEditor = ({ proposalData }) => {
  const [isPDF, setIsPDF] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [form, setForm] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    if (typeof proposalData === "string" && proposalData.endsWith(".pdf")) {
      setIsPDF(true);
      setFileUrl(proposalData);
    } else if (typeof proposalData === "object") {
      setIsPDF(false);
      setForm(proposalData);
    }
  }, [proposalData]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const version = { id: uuidv4(), timestamp: new Date().toISOString(), data: form };
    setVersionHistory(prev => [version, ...prev]);
    console.log("Saved Version:", version);
    // Post to backend if needed
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === "application/pdf") {
      setIsPDF(true);
      reader.onloadend = () => setFileUrl(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type === "application/json") {
      setIsPDF(false);
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          setForm(json);
        } catch (err) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file format. Upload PDF or JSON.");
    }
  };

  const renderJsonEditor = () => (
    <div className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700">{key}</label>
          {typeof value === "string" && value.length > 100 ? (
            <ReactQuill
              theme="snow"
              className="mt-2"
              value={value}
              onChange={(val) => handleChange(key, val)}
            />
          ) : (
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Proposal
      </button>
    </div>
  );

  const renderPdfViewer = () => (
    <div className="flex flex-col items-center py-6">
      <h2 className="text-xl font-semibold mb-4">Proposal PDF Preview</h2>
      <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );

  const renderVersionHistory = () => (
    <div className="max-w-3xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-2">Version History</h3>
      <ul className="space-y-2">
        {versionHistory.map((v) => (
          <li
            key={v.id}
            className="border p-3 rounded text-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setForm(v.data)}
          >
            <strong>{new Date(v.timestamp).toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mb-6 flex justify-between items-center max-w-3xl mx-auto">
        <input
          type="file"
          accept=".pdf,.json"
          onChange={handleFileUpload}
          className="block w-full text-sm file:px-4 file:py-2 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      {isPDF ? renderPdfViewer() : renderJsonEditor()}
      {!isPDF && versionHistory.length > 0 && renderVersionHistory()}
    </section>
  );
};

export default ProposalEditor;
