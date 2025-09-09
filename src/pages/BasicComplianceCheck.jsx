import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { IoIosArrowBack, IoMdCloseCircle } from "react-icons/io";
import { MdOutlineError, MdOutlineLock } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { compressData, shouldCompress } from '../utils/compression';

const BasicComplianceCheck = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [complianceData, setComplianceData] = useState(null);

    useEffect(() => {
        const data = location.state && location.state.data;
        if (data) {
            setData(data);
            setComplianceData(data);
            //Delete the location.state.data
            delete location.state.data;
        } else {
            setData(null);
            // Fallback data structure for testing
            setComplianceData({
                missing_sections: [],
                format_issues: {},
                empty_sections: []
            });
        }
    }, []);

    const handleGeneratePDF = async () => {
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

            const contentType = (res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || '';

            let pdfBlob;
            if (contentType.includes('application/pdf')) {
                // Server returned raw PDF bytes
                pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            } else {
                // Fallback: server returned base64 (as text) inside the ArrayBuffer
                let base64Payload = '';
                try {
                    const decodedText = new TextDecoder('utf-8').decode(res.data);
                    // Could be plain base64 or data URL
                    base64Payload = decodedText.replace(/^data:application\/pdf;base64,/, '').trim();
                } catch (e) {
                    // As a last resort, try to interpret as already-correct bytes
                    pdfBlob = new Blob([res.data], { type: 'application/pdf' });
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
                }
            }

            const blobUrl = URL.createObjectURL(pdfBlob);

            // Download automatically
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `proposal-${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.pdf`;
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

    return (
        <div className="min-h-screen overflow-y-auto">
            <NavbarComponent />
            <div className="w-full mx-auto p-8 mt-16">
                {/* Compliance Check Title */}
                <h1 className="text-[24px] md:text-[32px] font-bold mb-4 text-center text-[#111827]">Compliance Check</h1>

                {/* Plan Banner */}
                {/* <div className="flex flex-col md:flex-row items-center justify-between bg-[#EFF6FF] rounded-lg px-6 py-4 mb-8 gap-4">
                    <span className="text-[#2563EB] text-[20px]">
                        Your current plan: <span className="font-semibold">Basic Plan</span>
                    </span>
                    <button className="bg-[#2563EB] text-white px-5 py-2 rounded-lg transition text-[16px]">Upgrade to Advanced</button>
                </div> */}

                {/* Basic Compliance Check */}
                <div className="flex flex-col gap-4">
                    <span className="text-black text-[20px] font-semibold mt-4 mb-4">
                        Basic Compliance Check
                    </span>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Missing Sections */}
                        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#7F1D1D]">Missing Sections</h2>
                            <p className="text-[#B91C1C] text-[14px] mb-4">Critical sections that need to be added</p>
                            <ul className="space-y-3">
                                {complianceData && complianceData.missing_sections && complianceData.missing_sections.length > 0 ? (
                                    complianceData.missing_sections.map((section, idx) => (
                                        <li key={idx} className="flex items-center justify-start gap-2">
                                            <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                            <span className="text-[#111827] text-[16px]">{section}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">No missing sections</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Format Issues */}
                        <div className="bg-[#FEFCE8] border-2 border-[#FEF0C7] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#713F12]">Format Issues</h2>
                            <p className="text-[#713F12] text-[14px] mb-4">Sections with formatting problems</p>
                            <ul className="space-y-3">
                                {complianceData && complianceData.format_issues && Object.keys(complianceData.format_issues).length > 0 ? (
                                    Object.entries(complianceData.format_issues).map(([section, issues], idx) => (
                                        <li key={idx} className="flex items-start justify-start gap-2">
                                            <MdOutlineError className="text-[20px] text-[#EAB308] mt-1 flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[#111827] text-[16px] font-medium">{section}</span>
                                                {issues.map((issue, issueIdx) => (
                                                    <span key={issueIdx} className="text-[#713F12] text-[14px] ml-2">• {issue}</span>
                                                ))}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">No format issues found</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Empty Sections */}
                        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#14532D]">Empty Sections</h2>
                            <p className="text-[#14532D] text-[14px] mb-4">Sections that need content</p>
                            <ul className="space-y-3">
                                {complianceData && complianceData.empty_sections && complianceData.empty_sections.length > 0 ? (
                                    complianceData.empty_sections.map((section, idx) => (
                                        <li key={idx} className="flex items-center justify-start gap-2">
                                            <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                            <span className="text-[#111827] text-[16px]">{section}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center justify-start gap-2">
                                        <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                        <span className="text-[#111827] text-[16px]">No empty sections</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Advanced Compliance Check Section */}
                <div className="relative my-8 rounded-xl overflow-hidden border-2 border-[#E5E7EB]">
                    {/* The blurred, dimmed content (placeholder cards) */}
                    <div className="pointer-events-none select-none">
                        <div className="flex flex-col gap-4 p-8">
                            <span className="text-black text-[20px] font-semibold mb-4">
                                Advanced Compliance Check
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start h-24" />
                                <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start h-24" />
                                <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start h-24" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6 h-32 md:h-40" />
                                <div className="bg-[#FEFCE8] border-2 border-[#FEF0C7] rounded-lg p-6 h-32 md:h-40" />
                                <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6 h-32 md:h-40" />
                            </div>
                            <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-6 mb-10 h-24" />
                        </div>
                    </div>
                    {/* Glassy, blurred overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                        <MdOutlineLock className="text-6xl text-[#2563EB] mb-4" />
                        <p className="text-2xl font-bold text-[#2563EB] mb-2 text-center">
                            Upgrade to unlock Advanced Compliance Check
                        </p>
                        <p className="text-md text-[#2563EB] text-center max-w-md">
                            Get detailed compliance insights, critical issue detection, and AI-powered suggestions by upgrading your plan.
                        </p>

                        <button className="bg-[#2563EB] text-white px-8 py-2 rounded transition text-[16px]"
                            onClick={() => navigate('/payment')}>
                            Upgrade
                        </button>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
                    <button className="border border-[#4B5563] text-[#4B5563] px-6 py-2 rounded transition text-[16px] flex items-center gap-2"
                        onClick={() => navigate('/editor')}>
                        <IoIosArrowBack className="text-[20px] text-[#4B5563]" />
                        Back to Editor
                    </button>
                    <button className="bg-[#2563EB] text-white px-8 py-2 rounded transition text-[16px]"
                        onClick={() => handleGeneratePDF()}>
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BasicComplianceCheck;
