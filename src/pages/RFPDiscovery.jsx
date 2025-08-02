import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import {
  MdOutlineShare,
  MdOutlineBookmark,
  MdOutlinePayments,
  MdOutlineCalendarMonth,
  MdOutlineAccountBalance,
  MdOutlineSearch,
  MdOutlineUpload,
} from "react-icons/md";
import NavbarComponent from "./NavbarComponent";

// Sidebar Component
const LeftSidebar = ({ isOpen, onClose, filters, setFilters, searchQuery, setSearchQuery, searchResults }) => {
  const categories = {
    fundingType: ["Infrastructure", "Education", "Healthcare", "Research & Development"],
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
        <h3 className="text-lg font-semibold text-[#111827]">Filters</h3>
        <button
          onClick={onClose}
          className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
        >
          ✕
        </button>
      </div>

      <div className="relative">
        {/* Search Input */}
        <div className="relative mb-6">
          <MdOutlineSearch className="absolute w-6 h-6 left-2 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] text-xl" />
          <input
            type="text"
            autoFocus
            placeholder="Search RFPs"
            className="w-full text-[16px] text-[#9CA3AF] bg-[#FFFFFF] pl-10 p-2 border border-1 border-[#E5E7EB] rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdown Search Results */}
        {searchQuery && (
          <div className="absolute z-50 bg-white border mt-2 rounded-md shadow w-72 max-h-64 overflow-y-auto">
            {searchResults.length ? (
              searchResults.map((rfp) => (
                <a
                  key={rfp._id}
                  href={rfp.link}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800 border-b last:border-b-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="font-medium">{rfp.title}</div>
                  <div className="text-gray-500 text-xs">{rfp.organization}</div>
                  <div className="text-gray-400 text-xs">Deadline: {rfp.deadline}</div>
                </a>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">No matches found</div>
            )}
          </div>
        )}
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
                className="mr-2 text-[#4B5563]"
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
    <>
      {/* Desktop Sidebar */}
      {isOpen && (
        <div className="hidden lg:block fixed top-20 left-0 h-[calc(100vh-4rem)] z-40">
          {content}
        </div>
      )}

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-4 z-40">
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={onClose}
          />
          <div className="fixed top-0 left-0 z-40 bg-white w-64 h-full shadow-lg">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

// Main Component
const DiscoverRFPs = () => {
  const [filters, setFilters] = useState({ fundingType: [], deadline: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allRFPs, setAllRFPs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [saved, setSaved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        const res = await axios.get("https://proposal-form-backend.vercel.app/api/rfp/getAllRFP", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { allRFPs, recommendedRFPs, recentRFPs, savedRFPs } = res.data;

        setAllRFPs(allRFPs ?? []);
        setRecommended(recommendedRFPs ?? []);
        setRecent(recentRFPs ?? []);
        setSaved(savedRFPs ?? []);
      } catch (err) {
        console.error("Backend failed, loading dummy data...");

        const dummyRFPs = [
          {
            id: 1,
            logo: "https://via.placeholder.com/32",
            title: "AI Research Grant Program",
            description: "Supporting innovative AI research projects.",
            match: 95,
            budget: "$250,000 - $500,000",
            deadline: "Mar 15, 2025",
            organization: "Government Agency",
            fundingType: "Research & Development",
            organizationType: "Government",
            link: "#",
          },
          {
            id: 2,
            logo: "https://via.placeholder.com/32?text=T",
            title: "Tech Infrastructure Development",
            description: "Boosting national technology capacity.",
            match: 92,
            budget: "$300,000",
            deadline: "Apr 20, 2025",
            organization: "TechFund",
            fundingType: "Infrastructure",
            organizationType: "Private Sector",
            link: "#",
          },
          {
            id: 3,
            logo: "https://via.placeholder.com/32",
            title: "AI Research Grant Program",
            description: "Supporting innovative AI research projects.",
            match: 95,
            budget: "$250,000 - $500,000",
            deadline: "Mar 15, 2025",
            organization: "Government Agency",
            fundingType: "Research & Development",
            organizationType: "Government",
            link: "#",
          },

        ];

        setRecommended(dummyRFPs);
        setRecent(dummyRFPs);
        setSaved([]);
        setAllRFPs([...recommended, ...recent, ...saved])
      }
    };

    fetchRFPs();
  }, []);

  const applyFilters = (rfps) => {
    return rfps.filter((rfp) => {
      if (
        filters.fundingType.length &&
        !filters.fundingType.includes(rfp.fundingType)
      )
        return false;

      // Handle deadline filtering based on the deadline values
      if (filters.deadline.length) {
        const deadlineDate = new Date(rfp.deadline);
        const now = new Date();
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
    try {
      const res = await axios.post("https://proposal-form-backend.vercel.app/api/rfp/saveRFP", { rfpId: rfp._id, rfp: rfp }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 201 || res.status === 200) {
        setSaved((prev) => [...prev, rfp]);
        console.log("RFP data:", rfp);
      }
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const searchResults =
    searchQuery.trim() === ""
      ? []
      : allRFPs.filter((rfp) => {
        const pattern = new RegExp(`\\b${searchQuery.toLowerCase()}`, "i")
        return pattern.test(rfp.title.toLowerCase());
      });


  const handleUnsave = async (rfpId) => {
    try {
      console.log("sending request...");
      const res = await axios.post("https://proposal-form-backend.vercel.app/api/rfp/unsaveRFP", { rfpId: rfpId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        console.log("Handling Unsave...");
        setSaved((prev) => prev.filter((r) => r._id !== rfpId));
      }
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleGenerateProposal = (rfp) => {
    console.log("Generating proposal for:", rfp.title);
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
            {isSaved ? (
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
            {isSaved ? (
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

  const SavedRFPCard = ({ rfp, handleSave, handleUnsave, handleShare, isSaved }) => {
    const statusStyles = {
      "In Progress": "bg-blue-100 text-blue-600",
      Submitted: "bg-green-100 text-green-600",
      Rejected: "bg-red-100 text-red-600",
      Won: "bg-yellow-100 text-yellow-600",
    };
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
            className={`text-[12px] px-3 py-1 rounded-full font-medium ${statusStyles[rfp.status] || "bg-gray-100 text-gray-600"
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
            {isSaved ? (
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

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <NavbarComponent />
      <LeftSidebar
        isOpen={isSearchFocused}
        onClose={() => setIsSearchFocused(false)}
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
      />
      <main className="pt-20 px-6 py-6 ml-0 lg:ml-0">
        {/* Search Bar Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input with Advanced Search Button */}
            <div className="relative flex-1 max-w-[80%]">
              <div className="relative">
                <MdOutlineSearch className="absolute w-6 h-6 left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search RFPs by keyword, organization or category"
                  className="w-full text-[18px] text-[#9CA3AF] bg-[#FFFFFF] pl-12 pr-32 py-3 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                <button
                  className="absolute right-2 top-1/2 rounded-xl transform -translate-y-1/2 text-[#6B7280] text-[14px] font-medium hover:text-[#2563EB] transition-colors"
                  onClick={() => setIsSearchFocused(true)}
                >
                  Advanced Search
                </button>
              </div>
            </div>

            {/* Upload RFP Button */}
            <button className="flex items-center gap-2 text-[16px] text-white bg-[#2563EB] px-4 py-3 rounded-md hover:cursor-pointer transition-colors">
              <MdOutlineUpload className="w-5 h-5" />
              Upload RFP
            </button>
          </div>
        </div>

        {/* Mobile Filter Button */}
        {/* <div className="lg:hidden flex justify-end mb-6">
          <button
            onClick={() => setIsSearchFocused(true)}
            className="flex items-center gap-2 text-sm text-white bg-[#2563EB] px-3 py-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17V13.414L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
        </div> */}

        <h2 className="text-[24px] text-[#000000] font-semibold mb-4">AI Recommended RFPs</h2>
        {recommended.length ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(recommended).map((rfp) => (
              <RFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
                handleGenerateProposal={handleGenerateProposal}
              />
            ))}
          </div>
        ) : (
          <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Please fill the profile to get recommended RFPs.</p>
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Recently Added RFPs</h2>
        {recent.length ? (
          <div className="flex overflow-x-auto pb-2 custom-scroll">
            {applyFilters(recent).map((rfp) => (
              <RecentRFPCard
                key={rfp._id}
                rfp={rfp}
                isSaved={!!saved.find((s) => s._id === rfp._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Discover & add some RFPs to view them!</p>
        )}

        <h2 className="text-[24px] text-[#000000] font-semibold mt-10 mb-4">Saved RFPs</h2>
        {saved.length ? (
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
                  {saved.map((rfp) => (
                    <SavedRFPCard
                      key={rfp._id}
                      rfp={rfp}
                      handleSave={handleSave}
                      handleUnsave={handleUnsave}
                      handleShare={handleShare}
                      isSaved={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-[16px] text-[#4B5563]">Oops! Nothing here. Discover & save some RFPs to view them!</p>
        )}
      </main>
    </div>
  );
};

export default DiscoverRFPs;

