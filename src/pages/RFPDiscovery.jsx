import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import PropTypes from "prop-types";
import {
  MdOutlineShare,
  MdOutlineBookmark,
  MdOutlinePayments,
  MdOutlineCalendarMonth,
  MdOutlineAccountBalance,
  MdOutlineSearch,
  MdOutlineUpload,
  MdOutlineClose,
  MdOutlineExpandMore,
  MdOutlineCheck,
} from "react-icons/md";
import NavbarComponent from "./NavbarComponent";

// Constants
const API_BASE_URL = "https://proposal-form-backend.vercel.app/api/rfp";
const STATUS_STYLES = {
  "In Progress": "bg-blue-100 text-blue-600",
  Submitted: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  Won: "bg-yellow-100 text-yellow-600",
};

// Sidebar Component
const LeftSidebar = ({ isOpen, onClose, filters, setFilters }) => {
  const categories = {
    category: ["Infrastructure", "Education", "Healthcare", "Research & Development", "Government", "Non-Profit", "Private Sector"],
    deadline: ["This Week", "This Month", "Next 3 Months", "Next 6 Months"],
  };

  const handleChange = (type, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      updated[type] = prev[type]?.includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...(prev[type] || []), value];
      return updated;
    });
  };

  const content = (

    
    <div className="p-4 w-64 bg-white h-full overflow-y-auto border-r">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[22px] font-semibold text-[#000000]">Filters</h3>
        <button
          onClick={onClose}
          className="hover:cursor-pointer"
        >
          <MdOutlineClose className="w-6 h-6 text-[#4B5563] hover:text-[#111827]" />
        </button>
      </div>

      {Object.entries(categories).map(([category, values]) => (
        <div key={category} className="mb-4">
          <h3 className="text-[16px] font-medium text-[#111827] capitalize mb-2">
            {category.replace(/([A-Z])/g, " $1")}
          </h3>
          {values.map((value) => (
            <div key={value} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                checked={filters[category]?.includes(value) || false}
                onChange={() => handleChange(category, value)}
              />
              <label className="text-[16px] text-[#6B7280]">{value}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
      {isOpen && content}
    </div>
  );
};

// PropTypes for LeftSidebar
LeftSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

// Custom MultiSelect Component for Industries
const IndustryMultiSelect = ({ selectedIndustries, onIndustryChange, industries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIndustries = industries.filter(industry =>
    industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleIndustry = (industry) => {
    if (selectedIndustries.includes(industry)) {
      onIndustryChange(selectedIndustries.filter(i => i !== industry));
    } else {
      onIndustryChange([...selectedIndustries, industry]);
    }
  };

  const handleRemoveIndustry = (industry) => {
    onIndustryChange(selectedIndustries.filter(i => i !== industry));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIndustries.map((industry) => (
          <span
            key={industry}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[#2563EB] text-white text-xs rounded-full"
          >
            {industry}
            <button
              onClick={() => handleRemoveIndustry(industry)}
              className="ml-1 hover:text-red-200"
            >
              <MdOutlineClose className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-[#E5E7EB] rounded-md bg-white text-left hover:border-[#2563EB] focus:outline-none focus:ring-[2px] focus:ring-[#2563EB]"
      >
        <span className={selectedIndustries.length > 0 ? "text-[#111827]" : "text-[#9CA3AF]"}>
          {selectedIndustries.length > 0
            ? `${selectedIndustries.length} industr${selectedIndustries.length > 1 ? 'ies' : 'y'} selected`
            : "Select industries..."
          }
        </span>
        <MdOutlineExpandMore className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border border-[#E5E7EB] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredIndustries.map((industry) => (
              <div
                key={industry}
                onClick={() => handleToggleIndustry(industry)}
                className="flex items-center justify-between px-3 py-2 hover:bg-[#F3F4F6] cursor-pointer"
              >
                <span className="text-sm text-[#111827]">{industry}</span>
                {selectedIndustries.includes(industry) && (
                  <MdOutlineCheck className="w-4 h-4 text-[#2563EB]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for IndustryMultiSelect
IndustryMultiSelect.propTypes = {
  selectedIndustries: PropTypes.arrayOf(PropTypes.string).isRequired,
  onIndustryChange: PropTypes.func.isRequired,
  industries: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Main Component
const DiscoverRFPs = () => {
  const [filters, setFilters] = useState({ category: [], deadline: [] });
  const [recommended, setRecommended] = useState([]);
  const [otherRFPs, setOtherRFPs] = useState([]);
  const [saved, setSaved] = useState([]);
  const [originalRecommended, setOriginalRecommended] = useState([]);
  const [originalOtherRFPs, setOriginalOtherRFPs] = useState([]);
  const [originalSaved, setOriginalSaved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [availableIndustries, setAvailableIndustries] = useState([]);
  const [loadingOtherRFPs, setLoadingOtherRFPs] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingSave, setLoadingSave] = useState({});
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  // Add this state for upload loading
  const [isUploading, setIsUploading] = useState(false);

  const triggerRFPDiscovery = async () => {
    const res = await axios.post(`${API_BASE_URL}/triggerRFPDiscovery`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    //console.log(res.data);
  };

  useEffect(() => {
    triggerRFPDiscovery();
  }, []);

  // Set available industries statically
  useEffect(() => {
    setAvailableIndustries([
      "Information Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Retail",
      "Construction",
      "Consulting",
      "Marketing",
      "Legal",
      "Real Estate",
      "Transportation",
      "Hospitality",
      "Government",
      "Non-Profit",
      "Research & Development",
    ]);
  }, []);

  // Function to fetch other RFPs based on selected industries
  const fetchOtherRFPs = async () => {
    if (selectedIndustries.length === 0) {
      alert("Please select at least one industry to search for RFPs.");
      return;
    }

    setLoadingOtherRFPs(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/getOtherRFPs`, {
        industries: selectedIndustries
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const rfps = res.data.otherRFPs || [];
      setOtherRFPs(rfps);
      setOriginalOtherRFPs(rfps);
    } catch (err) {
      //console.error("Failed to fetch other RFPs, using dummy data...");
      setOtherRFPs([]);
      setOriginalOtherRFPs([]);
    } finally {
      setLoadingOtherRFPs(false);
    }
  };

  const fetchRFPs = async () => {
    setLoadingRecommended(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/getRecommendedAndSavedRFPs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { recommendedRFPs, savedRFPs } = res.data;

      setRecommended(recommendedRFPs ?? []);
      setOriginalRecommended(recommendedRFPs ?? []);
      setSaved(savedRFPs ?? []);
      setOriginalSaved(savedRFPs ?? []);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      //console.error("Backend failed, loading dummy data...");
      setError("Failed to load recommended and saved RFPs. Please try again later.");
    } finally {
      setLoadingRecommended(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchRFPs();
    } else {
      setError("Maximum retry attempts reached. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchRFPs();
  }, []);

  const applyFilters = (rfps) => {
    return rfps.filter((rfp) => {
      if (
        filters.category.length &&
        (filters.category.includes("None") ? false : !filters.category.includes(rfp.fundingType))
      )
        return false;

      // Handle deadline filtering based on the deadline values
      if (filters.deadline.length) {
        const now = new Date();
        const deadlineDate = rfp.deadline === "Not Disclosed" ? new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()) : new Date(rfp.deadline);
        const hasMatchingDeadline = filters.deadline.some(filter => {
          switch (filter) {
            case "This Week":
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              return deadlineDate <= weekFromNow;
            case "This Month":
              const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
              return deadlineDate <= monthFromNow;
            case "Next 3 Months":
              const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
              return deadlineDate <= threeMonthsFromNow;
            case "Next 6 Months":
              const sixMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
              return deadlineDate <= sixMonthsFromNow;
            case "Not Disclosed":
              return deadlineDate <= now;
            default:
              return true;
          }
        });
        if (!hasMatchingDeadline) return false;
      }

      return true;
    });
  };

  const handleSave = async (rfp) => {
    setLoadingSave(prev => ({ ...prev, [rfp._id]: true }));
    try {
      const res = await axios.post(`${API_BASE_URL}/saveRFP`, { rfpId: rfp._id, rfp: rfp }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 201 || res.status === 200) {
        setSaved((prev) => [...prev, rfp]);
        //console.log("RFP data:", rfp);
      }
    } catch (err) {
      //console.error(err);
      alert("Failed to save RFP. Please try again.");
    } finally {
      setLoadingSave(prev => ({ ...prev, [rfp._id]: false }));
    }
  };

  // Removed problematic useEffect that was permanently modifying state

  const handleUnsave = async (rfpId) => {
    setLoadingSave(prev => ({ ...prev, [rfpId]: true }));
    try {
      //console.log("sending request...");
      const res = await axios.post(`${API_BASE_URL}/unsaveRFP`, { rfpId: rfpId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        //console.log("Handling Unsave...");
        setSaved((prev) => prev.filter((r) => r._id !== rfpId));
      }
    } catch (err) {
      //console.error(err);
      alert("Failed to unsave RFP. Please try again.");
    } finally {
      setLoadingSave(prev => ({ ...prev, [rfpId]: false }));
    }
  };

  const handleShare = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch((err) => {
      //console.error("Failed to copy link:", err);
      alert("Failed to copy link to clipboard");
    });
  };

  const handleGenerateProposal = (rfp) => {
    //console.log("Generating proposal for:", rfp.title);
    // navigate, open modal, or call backend here
    navigate("/proposal_page", { state: { proposal: rfp } });
  };

  const RFPCard = ({ rfp, isSaved, handleGenerateProposal }) => (
    <div className="bg-[#F8FAFC] rounded-xl p-4 shadow w-[355px] mr-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <img src={rfp.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
          <span className="text-[10px] text-[#15803D] bg-[#DCFCE7] px-2 py-1 rounded-full">
            {rfp.match}% Match
          </span>
        </div>
        <h3 className="font-semibold text-[#111827] text-[18px] mb-1">{rfp.title}</h3>
        <p className="text-[16px] text-[#4B5563] mb-2 truncate overflow-hidden whitespace-nowrap">{rfp.description}</p>
        <div className="text-[14px] text-[#4B5563CC] space-y-1">
          <div className="flex items-center gap-2">
            <MdOutlinePayments className="text-[16px] text-[#4B5563]" /> {rfp.budget === "Not found" ? "Not Disclosed" : rfp.budget}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineCalendarMonth className="text-[16px] text-[#4B5563]" /> Deadline: {rfp.deadline}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineAccountBalance className="text-[16px] text-[#4B5563] shrink-0" />
            <p className="truncate overflow-hidden whitespace-nowrap"> {rfp.organization} </p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 text-[#111827] text-lg">
            {loadingSave[rfp._id] ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#111827]"></div>
            ) : isSaved ? (
              <MdOutlineBookmark onClick={() => handleUnsave(rfp._id)} className="cursor-pointer text-[#111827]" title="Unsave" />
            ) : (
              <FaRegBookmark onClick={() => handleSave(rfp)} className="cursor-pointer" title="Save" />
            )}
            <MdOutlineShare onClick={() => handleShare(rfp.link)} className="cursor-pointer text-[#111827]" title="Share" />
          </div>

          <div className="flex justify-center mt-3 gap-2">
            <button
              onClick={() => handleGenerateProposal(rfp)}
              className="text-[#2563EB] text-[14px] font-medium hover:underline"
            >
              Generate
            </button>

            <a href={rfp.link}
              className="text-[14px] text-white bg-[#2563EB] px-2 py-1 rounded-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const RecentRFPCard = ({ rfp, isSaved }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm w-[355px] mr-4 flex flex-col justify-between border border-[#E5E7EB] flex-shrink-0">
      {/* Top Row: Title and Actions */}
      <div>
        <div className="flex justify-between items-center gap-8 mb-2">
          <h3 className="font-semibold text-[#111827] text-[18px]">{rfp.title}</h3>
          <div className="flex top-2 gap-2 text-lg text-[#111827]">
            {loadingSave[rfp._id] ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#111827]"></div>
            ) : isSaved ? (
              <MdOutlineBookmark
                onClick={() => handleUnsave(rfp._id)}
                className="cursor-pointer"
                title="Unsave"
              />
            ) : (
              <FaRegBookmark
                onClick={() => handleSave(rfp)}
                className="cursor-pointer"
                title="Save"
              />
            )}
            <MdOutlineShare
              onClick={() => handleShare(rfp.link)}
              className="cursor-pointer"
              title="Share"
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#4B5563] mb-3 line-clamp-2">
          {rfp.description}
        </p>

        {/* Meta Info */}
        <div className="text-[14px] text-[#6B7280] mb-4 space-y-1">
          <div className="flex items-center gap-2">
            <MdOutlineCalendarMonth className="text-[16px]" />
            <span>Deadline: {rfp.deadline}</span>
          </div>
          {/* <div className="flex items-center gap-2">
              <MdOutlineAccountBalance className="text-[16px]" />
              <span>{rfp.organization}</span>
            </div> */}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[#111827]">{rfp.budget === "Not found" ? "Not Disclosed" : rfp.budget}</span>
        <a
          href={rfp.link}
          className="text-[14px] text-[#2563EB]"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Details
        </a>
      </div>
    </div>
  );

  const SavedRFPCard = ({ rfp, isSaved }) => {
    return (
      <tr className="border-b last:border-none hover:bg-gray-50">
        <td className="px-4 py-3 text-left">
          <div className="font-medium text-[#111827] text-[14px] max-w-[200px] truncate" title={rfp.title}>
            {rfp.title}
          </div>
        </td>
        <td className="px-4 py-3 text-left">
          <div className="text-[#4B5563] text-[14px] max-w-[150px] truncate" title={rfp.organization}>
            {rfp.organization}
          </div>
        </td>
        <td className="px-4 py-3 text-left">
          <span className="text-[#2563EB] text-[14px] font-semibold">
            {rfp.budget === "Not found" ? "Not Disclosed" : rfp.budget}
          </span>
        </td>
        <td className="px-4 py-3 text-left">
          <div className="text-[#4B5563] text-[14px]">
            {rfp.deadline}
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span
            className={`text-[12px] px-3 py-1 rounded-full font-medium ${STATUS_STYLES[rfp.status] || "bg-gray-100 text-gray-600"
              }`}
          >
            {rfp.status || "None"}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex gap-2 text-xl justify-center text-[#4B5563]">
            <MdOutlineShare
              title="Share"
              className="cursor-pointer hover:text-[#2563EB] transition-colors"
              onClick={() => handleShare(rfp.link)}
            />
            {loadingSave[rfp._id] ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4B5563]"></div>
            ) : isSaved ? (
              <MdOutlineBookmark
                onClick={() => handleUnsave(rfp._id)}
                className="cursor-pointer hover:text-[#2563EB] transition-colors"
                title="Unsave"
              />
            ) : (
              <FaRegBookmark
                onClick={() => handleSave(rfp)}
                className="cursor-pointer hover:text-[#2563EB] transition-colors"
                title="Save"
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const UploadRFPModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      file: null,
    });

    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check if file is PDF or TXT
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')) {
          setFormData({ ...formData, file: file });
          setFilePreview(file.name);
        } else {
          alert('Please upload only PDF or TXT files.');
          e.target.value = '';
        }
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.file) {
        alert('Please upload a file.');
        return;
      }

      setIsUploading(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.file);

        const response = await axios.post(`${API_BASE_URL}/uploadRFP`, formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'multipart/form-data'
            }
          });

        if (response.status === 200) {
          alert(response.data.message);
          onClose();
          // Optionally refresh the RFP list after successful upload
          // window.location.reload();
        } else {
          alert('Failed to add document. Please try again.');
        }
      } catch (error) {
        console.error('Error adding document:', error);
        const errorMessage = error.response?.data?.message || 'Failed to add document. Please try again.';
        alert(errorMessage);
      } finally {
        setIsUploading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 max-w-[90vw] z-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Upload RFP File</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <MdOutlineClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload RFP</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2563EB] transition-colors">
                <input
                  type="file"
                  accept=".pdf, .txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-upload"
                  required
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-gray-600">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-[#2563EB] hover:text-[#1d4ed8]">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">PDF or TXT file only</div>
                  </div>
                </label>
              </div>
              {filePreview && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">{filePreview}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, file: null });
                        setFilePreview(null);
                        document.getElementById('document-upload').value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdOutlineClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  // Filter data based on search query with memoization
  const getFilteredData = useCallback((originalData) => {
    if (!searchQuery.trim()) return originalData;

    return originalData.filter((rfp) => {
      const pattern = new RegExp(`\\b${searchQuery.toLowerCase()}`, "i");
      return pattern.test(rfp.title?.toLowerCase() || "") ||
        pattern.test(rfp.organization?.toLowerCase() || "") ||
        pattern.test(rfp.fundingType?.toLowerCase() || "");
    });
  }, [searchQuery]);

  // Get filtered data for rendering with memoization
  const filteredRecommended = useMemo(() => getFilteredData(originalRecommended), [getFilteredData, originalRecommended]);
  const filteredOtherRFPs = useMemo(() => getFilteredData(originalOtherRFPs), [getFilteredData, originalOtherRFPs]);
  const filteredSaved = useMemo(() => getFilteredData(originalSaved), [getFilteredData, originalSaved]);

  const [activeTab, setActiveTab] = useState("rfp");
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <NavbarComponent />

      <LeftSidebar
        isOpen={isSearchFocused}
        onClose={() => setIsSearchFocused(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <main className="pt-20 px-8 md:px-12 py-6 ml-0">
        {/* Search Bar Section */}


        <div className="flex space-x-6 border-b border-gray-200 p-4">
  <button
    className={`pb-2 ${
      activeTab === "rfp"
        ? "text-blue-600 font-bold border-b-2 border-blue-600"
        : "font-bold text-gray-600"
    }`}
    onClick={() => setActiveTab("rfp")}
  >
    RFP's
  </button>

  <button
    className={`pb-2 ${
      activeTab === "grants"
        ? "text-blue-600 font-bold border-b-2 border-blue-600"
        : "font-bold text-gray-600"
    }`}
    onClick={() => setActiveTab("grants")}
  >
    Grant's
  </button>
</div>


      {activeTab === "rfp" && (
        <div>
          <div>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input with Advanced Search Button */}
            <div className="relative flex-1 w-full md:max-w-[90%]">
              <div className="relative">
                <MdOutlineSearch className="absolute w-6 h-6 left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search RFPs by title, organization or category"
                  className="w-full text-[18px] text-[#9CA3AF] bg-[#FFFFFF] pl-12 pr-32 py-3 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 px-4 py-2 rounded-xl transform -translate-y-1/2 bg-[#F3F4F6] text-[#111827] text-[14px] hover:bg-[#2563EB] hover:text-white transition-colors"
                  onClick={() => setIsSearchFocused(true)}
                >
                  Advanced Search
                </button>
              </div>
            </div>

            {/* Upload RFP Button */}
            <button className="flex items-center gap-2 text-[16px] text-white bg-[#2563EB] px-4 py-3 rounded-md hover:cursor-pointer transition-colors"
              onClick={() => setUploadModalOpen(true)}
            >
              <MdOutlineUpload className="w-5 h-5" />
              Upload RFP
            </button>
          </div>
        </div>

        <h2 className="text-[24px] text-[#000000] font-semibold mb-4">AI Recommended RFPs</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              {retryCount > 0 ? `Try again (${retryCount}/3)` : "Try again"}
            </button>
          </div>
        )}
        {loadingRecommended ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
            <span className="ml-3 text-[16px] text-[#4B5563]">Loading recommended RFPs...</span>
          </div>
        ) : filteredRecommended.length ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(filteredRecommended).map((rfp) => (
              <RFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
                handleGenerateProposal={handleGenerateProposal}
              />
            ))}
          </div>
        ) : (
          (!error && (
            <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Please fill the profile to get recommended RFPs.</p>
          ))
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Other RFPs</h2>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Industry Selection */}
            <div>
              <label className="block text-[16px] font-medium text-[#111827] mb-2">
                Select Industries to Filter RFPs
              </label>
              <IndustryMultiSelect
                selectedIndustries={selectedIndustries}
                onIndustryChange={setSelectedIndustries}
                industries={availableIndustries}
              />
            </div>

            {/* Search Button */}
            <div className="flex justify-start md:justify-end">
              <button
                onClick={fetchOtherRFPs}
                disabled={selectedIndustries.length === 0 || loadingOtherRFPs}
                className={`flex items-center gap-2 px-6 py-3 rounded-md text-[16px] font-medium transition-colors ${selectedIndustries.length === 0 || loadingOtherRFPs
                  ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#2563EB] text-white hover:bg-[#1d4ed8] cursor-pointer"
                  }`}
              >
                {loadingOtherRFPs ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <MdOutlineSearch className="w-5 h-5" />
                    <span>Search RFPs</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {loadingOtherRFPs ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
            <span className="ml-3 text-[16px] text-[#4B5563]">Loading RFPs...</span>
          </div>
        ) : filteredOtherRFPs.length > 0 ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(filteredOtherRFPs).map((rfp) => (
              <RecentRFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
              />
            ))}
          </div>
        ) : filteredOtherRFPs.length === 0 && selectedIndustries.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-[16px] text-[#4B5563] mb-2">No RFPs found for the selected industries.</p>
            <p className="text-[14px] text-[#6B7280]">Try selecting different industries or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[16px] text-[#4B5563] mb-2">Select industries and click "Search RFPs" to discover relevant opportunities.</p>
            <p className="text-[14px] text-[#6B7280]">Choose from the available industries to filter and find RFPs that match your expertise.</p>
          </div>
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Saved RFPs</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              {retryCount > 0 ? `Try again (${retryCount}/3)` : "Try again"}
            </button>
          </div>
        )}

        {!error && (
          filteredSaved.length > 0 ? (
            <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="text-[#374151] text-[14px] font-medium">
                      <th className="px-4 py-3 text-left">RFP Title</th>
                      <th className="px-4 py-3 text-left">Organisation</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Deadline</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSaved.map((rfp) => (
                      <SavedRFPCard
                        key={rfp._id}
                        rfp={rfp}
                        isSaved={true}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Discover & save some RFPs to view them!</p>
          )
        )}
      </div>
        </div>
      )}

      {activeTab === "grants" && (
        <div>
          <div>
        {/* <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full md:max-w-[90%]">
              <div className="relative">
                <MdOutlineSearch className="absolute w-6 h-6 left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search RFPs by title, organization or category"
                  className="w-full text-[18px] text-[#9CA3AF] bg-[#FFFFFF] pl-12 pr-32 py-3 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 px-4 py-2 rounded-xl transform -translate-y-1/2 bg-[#F3F4F6] text-[#111827] text-[14px] hover:bg-[#2563EB] hover:text-white transition-colors"
                  onClick={() => setIsSearchFocused(true)}
                >
                  Advanced Search
                </button>
              </div>
            </div>
            <button className="flex items-center gap-2 text-[16px] text-white bg-[#2563EB] px-4 py-3 rounded-md hover:cursor-pointer transition-colors"
              onClick={() => setUploadModalOpen(true)}
            >
              <MdOutlineUpload className="w-5 h-5" />
              Upload RFP
            </button>
          </div>
        </div> */}

        <h2 className="text-[24px] text-[#000000] font-semibold mb-4">Recently Added Grant's</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              {retryCount > 0 ? `Try again (${retryCount}/3)` : "Try again"}
            </button>
          </div>
        )}
        {loadingRecommended ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
            <span className="ml-3 text-[16px] text-[#4B5563]">Loading Recently Added Grant's...</span>
          </div>
        ) : filteredRecommended.length ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(filteredRecommended).map((rfp) => (
              <RFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
                handleGenerateProposal={handleGenerateProposal}
              />
            ))}
          </div>
        ) : (
          (!error && (
            <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Please fill the profile to get recommended RFPs.</p>
          ))
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Other Grant's</h2>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Industry Selection */}
            <div>
              <label className="block text-[16px] font-medium text-[#111827] mb-2">
                Select Industries to Filter Grant's
              </label>
              <IndustryMultiSelect
                selectedIndustries={selectedIndustries}
                onIndustryChange={setSelectedIndustries}
                industries={availableIndustries}
              />
            </div>

            {/* Search Button */}
            <div className="flex justify-start md:justify-end">
              <button
                onClick={fetchOtherRFPs}
                disabled={selectedIndustries.length === 0 || loadingOtherRFPs}
                className={`flex items-center gap-2 px-6 py-3 rounded-md text-[16px] font-medium transition-colors ${selectedIndustries.length === 0 || loadingOtherRFPs
                  ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#2563EB] text-white hover:bg-[#1d4ed8] cursor-pointer"
                  }`}
              >
                {loadingOtherRFPs ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <MdOutlineSearch className="w-5 h-5" />
                    <span>Search Grant's</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {loadingOtherRFPs ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
            <span className="ml-3 text-[16px] text-[#4B5563]">Loading Grant's...</span>
          </div>
        ) : filteredOtherRFPs.length > 0 ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(filteredOtherRFPs).map((rfp) => (
              <RecentRFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
              />
            ))}
          </div>
        ) : filteredOtherRFPs.length === 0 && selectedIndustries.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-[16px] text-[#4B5563] mb-2">No Grant's found for the selected industries.</p>
            <p className="text-[14px] text-[#6B7280]">Try selecting different industries or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[16px] text-[#4B5563] mb-2">Select industries and click "Search Grant's" to discover relevant opportunities.</p>
            <p className="text-[14px] text-[#6B7280]">Choose from the available industries to filter and find Grant's that match your expertise.</p>
          </div>
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Saved Grant's</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              {retryCount > 0 ? `Try again (${retryCount}/3)` : "Try again"}
            </button>
          </div>
        )}

        {!error && (
          filteredSaved.length > 0 ? (
            <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="text-[#374151] text-[14px] font-medium">
                      <th className="px-4 py-3 text-left">Grant Title</th>
                      <th className="px-4 py-3 text-left">Organisation</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Deadline</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSaved.map((rfp) => (
                      <SavedRFPCard
                        key={rfp._id}
                        rfp={rfp}
                        isSaved={true}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Discover & save some RFPs to view them!</p>
          )
        )}
      </div>
        </div>
      )}

      </main>

      <UploadRFPModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};

export default DiscoverRFPs;
