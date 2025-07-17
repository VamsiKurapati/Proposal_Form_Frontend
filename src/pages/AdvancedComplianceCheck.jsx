import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { IoIosArrowBack, IoMdCloseCircle } from "react-icons/io";
import { MdOutlineDoneAll, MdOutlineError } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";

const AdvancedComplianceCheck = () => {
    const location = useLocation();
    const [data, setData] = useState(null);
    const [basicComplianceCheck, setBasicComplianceCheck] = useState(null);
    const [complianceScore, setComplianceScore] = useState(0);
    const [issuesIdentified, setIssuesIdentified] = useState(0);
    const [advancedComplianceCheck, setAdvancedComplianceCheck] = useState(null);
    const [aiSuggestions, setAiSuggestions] = useState(null);

    useEffect(() => {
        const data = location.state && location.state.data;
        if (data) {
            setData(data);
            setBasicComplianceCheck(data.basicComplianceCheck);
            setAdvancedComplianceCheck(data.advancedComplianceCheck);
            setAiSuggestions(data.aiSuggestions);
        } else {
            setData(null);
            setBasicComplianceCheck([{
                title: "Critical Issues Found",
                description: "Please address these issues before submission",
                issues: ["Missing executive summary", "Font format issues", "Incomplete cover letter"],
            },
            {
                title: "Missing Sections",
                description: "Please address these issues before submission",
                sections: ["Missing executive summary", "Font format issues", "Incomplete cover letter"],
            },
            {
                title: "Completed Sections",
                description: "Recheck before submission if needed",
                sections: ["Complete section", "Partnership Overview", "Financial Summary"],
            }]);
            setComplianceScore(0);
            setIssuesIdentified(0);
            setAdvancedComplianceCheck([{
                title: "Critical Issues Found",
                description: "Please address these issues before submission",
                issues: ["Missing executive summary", "Font format issues", "Incomplete cover letter"],
            },
            {
                title: "Missing Sections",
                description: "Please address these issues before submission",
                sections: ["Missing executive summary", "Font format issues", "Incomplete cover letter"],
            },
            {
                title: "Completed Sections",
                description: "Recheck before submission if needed",
                sections: ["Complete section", "Partnership Overview", "Financial Summary"],
            }]);
            setAiSuggestions([{
                title: "AI Suggestions",
                description: "Please address these issues before submission",
                suggestions: ["Complete executive summary section with project overview.", "Add detailed budget breakdown.", "Change the font & font style of the headlines.", "Do some kind of changes as suggested by AI."],
            }]);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />
            <div className="w-full mx-auto p-8 mt-16">
                {/* Compliance Check Title */}
                <h1 className="text-[24px] font-semibold mb-4">Compliance Check</h1>
                {/* Basic Compliance Check */}
                <div className="flex flex-col gap-4">
                    <span className="text-black text-[20px] font-semibold mt-4 mb-4">
                        Basic Compliance Check
                    </span>
                    {/* Compliance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Critical Issues */}
                        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#7F1D1D]">{basicComplianceCheck && basicComplianceCheck[0].title}</h2>
                            <p className="text-[#B91C1C] text-[14px] mb-4">{basicComplianceCheck && basicComplianceCheck[0].description}</p>
                            <ul className="space-y-3">
                                {basicComplianceCheck && basicComplianceCheck[0].issues && basicComplianceCheck[0].issues.map((issue, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                        <span className="text-[#111827] text-[16px]">{issue}</span>
                                    </li>
                                ))}
                                {basicComplianceCheck && basicComplianceCheck[0].issues && basicComplianceCheck[0].issues.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                        <span className="text-[#111827] text-[16px]">No critical issues found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Missing Sections */}
                        <div className="bg-[#FEFCE8] border-2 border-[#FEF0C7] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#713F12]">{basicComplianceCheck && basicComplianceCheck[1].title}</h2>
                            <p className="text-[#713F12] text-[14px] mb-4">{basicComplianceCheck && basicComplianceCheck[1].description}</p>
                            <ul className="space-y-3">
                                {basicComplianceCheck && basicComplianceCheck[1].sections && basicComplianceCheck[1].sections.map((section, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <MdOutlineError className="text-[20px] text-[#EAB308]" />
                                        <span className="text-[#111827] text-[16px]">{section}</span>
                                    </li>
                                ))}
                                {basicComplianceCheck && basicComplianceCheck[1].sections && basicComplianceCheck[1].sections.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <MdOutlineError className="text-[20px] text-[#EAB308]" />
                                        <span className="text-[#111827] text-[16px]">No missing sections found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Completed Sections */}
                        <div className="bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#14532D]">{basicComplianceCheck && basicComplianceCheck[2].title}</h2>
                            <p className="text-[#14532D] text-[14px] mb-4">{basicComplianceCheck && basicComplianceCheck[2].description}</p>
                            <ul className="space-y-3">
                                {basicComplianceCheck && basicComplianceCheck[2].sections && basicComplianceCheck[2].sections.map((section, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">{section}</span>
                                    </li>
                                ))}
                                {basicComplianceCheck && basicComplianceCheck[2].sections && basicComplianceCheck[2].sections.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">No completed sections found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Advanced Compliance Check Section */}
                <div className="flex flex-col gap-4">
                    <span className="text-black text-[20px] font-semibold mt-4 mb-4">
                        Advanced Compliance Check
                    </span>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start">
                            <span className="text-[#6B7280] text-[18px]">Overall Compliance Score</span>
                            <span className="text-[#2563EB] text-[36px] font-semibold">{complianceScore}%</span>
                        </div>
                        <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start">
                            <span className="text-[#6B7280] text-[18px]">Issues Identified</span>
                            <span className="text-[#2563EB] text-[36px] font-semibold">{issuesIdentified}</span>
                        </div>
                        <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-4 flex flex-col items-start">
                            <span className="text-[#6B7280] text-[18px]">Suggestions</span>
                            <span className="text-[#2563EB] text-[36px] font-semibold">{aiSuggestions && aiSuggestions.length}</span>
                        </div>
                    </div>
                    {/* Compliance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Critical Issues */}
                        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#7F1D1D]">{advancedComplianceCheck && advancedComplianceCheck[0].title}</h2>
                            <p className="text-[#B91C1C] text-[14px] mb-4">{advancedComplianceCheck && advancedComplianceCheck[0].description}</p>
                            <ul className="space-y-3">
                                {advancedComplianceCheck && advancedComplianceCheck[0].issues && advancedComplianceCheck[0].issues.map((issue, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                        <span className="text-[#111827] text-[16px]">{issue}</span>
                                    </li>
                                ))}
                                {advancedComplianceCheck && advancedComplianceCheck[0].issues && advancedComplianceCheck[0].issues.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <IoMdCloseCircle className="text-[20px] text-[#EF4444]" />
                                        <span className="text-[#111827] text-[16px]">No critical issues found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Missing Sections */}
                        <div className="bg-[#FEFCE8] border-2 border-[#FEF0C7] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#713F12]">{advancedComplianceCheck && advancedComplianceCheck[1].title}</h2>
                            <p className="text-[#713F12] text-[14px] mb-4">{advancedComplianceCheck && advancedComplianceCheck[1].description}</p>
                            <ul className="space-y-3">
                                {advancedComplianceCheck && advancedComplianceCheck[1].sections && advancedComplianceCheck[1].sections.map((section, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <MdOutlineError className="text-[20px] text-[#EAB308]" />
                                        <span className="text-[#111827] text-[16px]">{section}</span>
                                    </li>
                                ))}
                                {advancedComplianceCheck && advancedComplianceCheck[1].sections && advancedComplianceCheck[1].sections.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <MdOutlineError className="text-[20px] text-[#EAB308]" />
                                        <span className="text-[#111827] text-[16px]">No missing sections found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Completed Sections */}
                        <div className="bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-lg p-6">
                            <h2 className="text-[16px] font-semibold text-[#14532D]">{advancedComplianceCheck && advancedComplianceCheck[2].title}</h2>
                            <p className="text-[#14532D] text-[14px] mb-4">{advancedComplianceCheck && advancedComplianceCheck[2].description}</p>
                            <ul className="space-y-3">
                                {advancedComplianceCheck && advancedComplianceCheck[2].sections && advancedComplianceCheck[2].sections.map((section, idx) => (
                                    <li key={idx} className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">{section}</span>
                                    </li>
                                ))}
                                {advancedComplianceCheck && advancedComplianceCheck[2].sections && advancedComplianceCheck[2].sections.length === 0 && (
                                    <li className="flex items-center justify-start gap-2">
                                        <BsFillCheckCircleFill className="text-[20px] text-[#16A34A]" />
                                        <span className="text-[#111827] text-[16px]">No completed sections found</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* AI Suggestions */}
                    <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-lg p-6 mb-10">
                        <h2 className="text-[20px] font-semibold text-[#2563EB] mb-4">AI Suggestions</h2>
                        <ul className="space-y-3">
                            {aiSuggestions && aiSuggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-center justify-start gap-2">
                                    <MdOutlineDoneAll className="text-[20px] text-[#2563EB]" />
                                    <span className="text-[#111827] text-[16px]">{suggestion.title}</span>
                                </li>
                            ))}
                            {aiSuggestions && aiSuggestions.length === 0 && (
                                <li className="flex items-center justify-start gap-2">
                                    <MdOutlineDoneAll className="text-[20px] text-[#2563EB]" />
                                    <span className="text-[#111827] text-[16px]">No AI suggestions found</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* Navigation Buttons */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
                        <button className="border border-[#4B5563] text-[#4B5563] px-6 py-2 rounded transition text-[16px] flex items-center gap-2">
                            <IoIosArrowBack className="text-[20px] text-[#4B5563]" />
                            Back to Editor
                        </button>
                        <button className="bg-[#2563EB] text-white px-8 py-2 rounded transition text-[16px]">Fix Issues</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedComplianceCheck;
