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
        executiveSummary: { objective: "", keyOutcomes: "" },
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
      console.log(content);
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
    printSection("Key Outcomes", form.executiveSummary?.keyOutcomes || "");
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
              <div className="mt-4">
                <CustomQuillEditor
                  value={form.executiveSummary?.keyOutcomes || ""}
                  onChange={(val) => handleChange("executiveSummary", "keyOutcomes", val)}
                />
              </div>
            </>
          )}

          {renderSection("Project Plan", "projectPlan",
            <>
              {(form.projectPlan || []).map((phase, i) => (
                <div key={i} className="border p-3 rounded mb-4">
                  <CustomQuillEditor value={phase.phase} onChange={(val) => handleArrayChange("projectPlan", i, "phase", val)} />
                  <div className="mt-4">
                  <CustomQuillEditor value={phase.timeline} onChange={(val) => handleArrayChange("projectPlan", i, "timeline", val)} />
                  </div>
                  <div className="mt-4">
                  <CustomQuillEditor value={phase.deliverable} onChange={(val) => handleArrayChange("projectPlan", i, "deliverable", val)} />
                  </div>
                </div>
              ))}
            </>
          )}

          {renderSection("Partnership & Pricing", "partnership",
            <>
              <CustomQuillEditor value={form.partnership?.budgetRange || ""} onChange={(val) => handleChange("partnership", "budgetRange", val)} />
              <div className="mt-4">
              <CustomQuillEditor value={form.partnership?.contact || ""} onChange={(val) => handleChange("partnership", "contact", val)} />
              </div>
            </>
          )}

          {renderSection("References", "references",
            <>
              {(form.references || []).map((ref, i) => (
                <div key={i} className="space-y-2">
                  <CustomQuillEditor value={ref.project} onChange={(val) => handleArrayChange("references", i, "project", val)} />
                    <div className="mt-4">
                  <CustomQuillEditor value={ref.client} onChange={(val) => handleArrayChange("references", i, "client", val)} />
                    </div>
                    <div className="mt-4">
                  <CustomQuillEditor value={ref.outcome} onChange={(val) => handleArrayChange("references", i, "outcome", val)} />
                    </div>
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
