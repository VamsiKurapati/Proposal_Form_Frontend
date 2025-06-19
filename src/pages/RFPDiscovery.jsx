// import React, { useState, useEffect } from "react";
// import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa";

// const Navbar = ({ onMenuClick }) => (
//   <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 z-50">
//     <div className="flex items-center gap-4">
//       <FiMenu className="text-xl lg:hidden" onClick={onMenuClick} />
//       <span className="font-bold text-xl">LOGO</span>
//       <div className="hidden md:flex gap-6 text-sm ml-6">
//         {["Discover", "Proposals", "Dashboard", "Profile"].map((item, i) => (
//           <a key={i} href="#" className="hover:text-blue-600 text-gray-700">{item}</a>
//         ))}
//       </div>
//     </div>
//     <div className="flex items-center gap-4">
//       <FiSearch className="text-lg" />
//       <FiBell className="text-lg" />
//       <FaUserCircle className="text-2xl text-gray-700" />
//     </div>
//   </nav>
// );

// const LeftSidebar = ({ isOpen, onClose, filters, setFilters }) => {
//   const categories = {
//     fundingType: ["Infrastructure", "Education", "Healthcare", "Research & Development"],
//     organizationType: ["Government", "Non-Profit", "Education", "Private Sector"],
//   };

//   const handleChange = (type, value) => {
//     setFilters(prev => {
//       const updated = { ...prev };
//       updated[type] = prev[type].includes(value)
//         ? prev[type].filter(v => v !== value)
//         : [...prev[type], value];
//       return updated;
//     });
//   };

//   const content = (
//     <div className="p-4 w-64 bg-white h-full overflow-y-auto border-r">
//       <input
//         type="text"
//         placeholder="Search RFPs"
//         className="w-full p-2 mb-6 border rounded-md"
//       />
//       {Object.entries(categories).map(([category, values]) => (
//         <div key={category} className="mb-4">
//           <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{category.replace(/([A-Z])/g, " $1")}</h3>
//           {values.map(value => (
//             <div key={value} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 className="mr-2"
//                 checked={filters[category].includes(value)}
//                 onChange={() => handleChange(category, value)}
//               />
//               <label>{value}</label>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <>
//       <div className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)]">{content}</div>
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={onClose} />
//           <div className="fixed top-0 left-0 z-40 bg-white w-64 h-full shadow-lg p-4">
//             <div className="text-right mb-4">
//               <button onClick={onClose} className="text-sm text-blue-600">Close</button>
//             </div>
//             {content}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// const RFPCard = ({ title, category, organization }) => (
//   <div className="bg-white rounded-lg p-4 shadow border w-[300px] flex-shrink-0">
//     <div className="flex justify-between items-center mb-2">
//       <h4 className="font-semibold text-sm">{title}</h4>
//       <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">95% Match</span>
//     </div>
//     <p className="text-xs text-gray-600 mb-4">Innovative project for {category}</p>
//     <ul className="text-xs text-gray-600 space-y-1 mb-4">
//       <li>💰 $250,000 - $500,000</li>
//       <li>📅 Deadline: Mar 15, 2024</li>
//       <li>🏛️ {organization}</li>
//     </ul>
//     <div className="flex justify-between items-center text-sm text-gray-600">
//       <div className="flex gap-2">
//         <span>🔖</span>
//         <span>🔗</span>
//       </div>
//       <button className="text-white bg-blue-600 px-3 py-1 rounded text-xs">View Details</button>
//     </div>
//   </div>
// );


// const RFPDiscovery = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filters, setFilters] = useState({ fundingType: [], organizationType: [] });
//   const [rfps, setRfps] = useState([]);

//   useEffect(() => {
//     const dummyRFPs = [
//       { id: 1, title: "AI Research Grant", category: "Research & Development", organization: "Government" },
//       { id: 2, title: "Tech Infrastructure", category: "Infrastructure", organization: "Government" },
//       { id: 3, title: "Educational Innovation", category: "Education", organization: "Non-Profit" },
//       { id: 4, title: "Healthcare Data Solutions", category: "Healthcare", organization: "Private Sector" },
//     ];
//     setRfps(dummyRFPs);
//   }, []);

//   const filteredRFPs = rfps.filter(rfp => {
//     const matchFunding = filters.fundingType.length ? filters.fundingType.includes(rfp.category) : true;
//     const matchOrg = filters.organizationType.length ? filters.organizationType.includes(rfp.organization) : true;
//     return matchFunding && matchOrg;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar onMenuClick={() => setShowSidebar(true)} />
//       <LeftSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} filters={filters} setFilters={setFilters} />

//       <main className="pt-20 px-4 lg:pl-72">
//         <section className="mb-10">
//           <h2 className="text-xl font-semibold mb-4">AI Recommended RFPs</h2>
//           <div className="flex gap-4 overflow-x-auto">
//             {filteredRFPs.map(rfp => <RFPCard key={rfp.id} {...rfp} />)}
//             {filteredRFPs.length === 0 && <p className="text-gray-500">No results match your filters.</p>}
//           </div>
//         </section>

//         <section className="mb-10">
//           <h2 className="text-xl font-semibold mb-2">Recently Added RFPs</h2>
//           <p className="text-gray-600 text-sm">Oops! Nothing here. Discover & add new RFPs to view them!</p>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2">Saved RFPs</h2>
//           <p className="text-gray-600 text-sm">Oops! Nothing here. Discover & save some RFPs to view them!</p>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default RFPDiscovery;




// import React, { useEffect, useState } from "react";
// import { MdBookmark, MdShare } from "react-icons/fa";
// import axios from "axios";

// const DiscoverRFPs = () => {
//   const [recommendedRFPs, setRecommendedRFPs] = useState([]);
//   const [recentRFPs, setRecentRFPs] = useState([]);
//   const [savedRFPs, setSavedRFPs] = useState([]);

//   useEffect(() => {
//     const fetchRFPs = async () => {
//       try {
//         const [recRes, recentRes, savedRes] = await Promise.all([
//           axios.get("/api/rfps/recommended"),
//           axios.get("/api/rfps/recent"),
//           axios.get("/api/rfps/saved"),
//         ]);

//         setRecommendedRFPs(recRes.data);
//         setRecentRFPs(recentRes.data);
//         setSavedRFPs(savedRes.data);
//       } catch (error) {
//         console.error("Failed to fetch RFPs:", error);
//       }
//     };

//     fetchRFPs();
//   }, []);

//   const handleSave = async (rfp) => {
//     try {
//       if (!savedRFPs.some((item) => item.id === rfp.id)) {
//         await axios.post("/api/rfps/save", rfp);
//         setSavedRFPs((prev) => [...prev, rfp]);
//       }
//     } catch (error) {
//       console.error("Failed to save RFP:", error);
//     }
//   };

//   const handleShare = (rfp) => {
//     navigator.clipboard.writeText(rfp.link);
//     alert("RFP link copied to clipboard!");
//   };

//   const RFPCard = ({ rfp, showSave = true }) => (
//     <div className="bg-[#f7faff] rounded-xl p-4 w-[300px] min-w-[300px] shadow relative">
//       <div className="flex items-center gap-2">
//         <img src={rfp.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
//         <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded">{rfp.match}% Match</span>
//       </div>
//       <h3 className="font-semibold text-sm mt-2 mb-1 leading-tight">{rfp.title}</h3>
//       <p className="text-xs text-gray-600 mb-2">{rfp.description}</p>
//       <ul className="text-xs text-gray-700 space-y-1">
//         <li>
//           <span className="font-medium">Amount:</span> {rfp.amount}
//         </li>
//         <li>
//           <span className="font-medium">Deadline:</span> {rfp.deadline}
//         </li>
//         <li>{rfp.organization}</li>
//       </ul>
//       <div className="mt-3 flex items-center justify-between text-sm">
//         <div className="flex gap-3">
//           {showSave && (
//             <button
//               className="text-gray-500 hover:text-blue-600"
//               onClick={() => handleSave(rfp)}
//               title="Save"
//             >
//               <MdBookmark />
//             </button>
//           )}
//           <button
//             className="text-gray-500 hover:text-blue-600"
//             onClick={() => handleShare(rfp)}
//             title="Share"
//           >
//             <MdShare />
//           </button>
//         </div>
//         <a
//           href={rfp.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
//         >
//           View Details
//         </a>
//       </div>
//     </div>
//   );

//   const Section = ({ title, data, showSave = true }) => (
//     <div className="mt-10">
//       <h2 className="text-xl font-semibold mb-4">{title}</h2>
//       {data.length === 0 ? (
//         <p className="text-sm text-gray-500">Oops! Nothing here. Discover & add new RFPs to view them!</p>
//       ) : (
//         <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
//           {data.map((rfp) => (
//             <RFPCard key={rfp.id} rfp={rfp} showSave={showSave} />
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="p-6">
//       <Section title="AI Recommended RFPs" data={recommendedRFPs} />
//       <Section title="Recently Added RFPs" data={recentRFPs} />
//       <Section title="Saved RFPs" data={savedRFPs} showSave={false} />
//     </div>
//   );
// };

// export default DiscoverRFPs;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { MdBookmark, FaRegBookmark, MdShare } from "react-icons/fa";

// const baseURL = "https://proposal-form-backend.vercel.app";

// const DiscoverRFPs = () => {
//   const [recommended, setRecommended] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [saved, setSaved] = useState([]);
//   const [filters, setFilters] = useState({});

//   useEffect(() => {
//     const fetchRFPData = async () => {
//         try {
//         const res = await axios.get(`${baseURL}/api/rfp/getrfps`);
//         const { recommendedRFPs, recentRFPs, savedRFPs } = res.data;
//         setRecommended(recommendedRFPs || []);
//         setRecent(recentRFPs || []);
//         setSaved(savedRFPs || []);
//         } catch (err) {
//         console.error("Error fetching RFPs:", err);
//         }
//     };

//     fetchRFPData();
//   }, []);

//   const handleSave = async (rfp) => {
//     try {
//       await axios.post(`${baseURL}/api/rfp/save-rfp`, { rfpId: rfp.id });
//       setSaved((prev) => [...prev, rfp]);
//     } catch (err) {
//       console.error("Error saving RFP:", err);
//     }
//   };

//   const handleUnsave = async (rfpId) => {
//     try {
//       await axios.post(`${baseURL}/api/rfp/unsave-rfp`, { rfpId });
//       setSaved((prev) => prev.filter((r) => r.id !== rfpId));
//     } catch (err) {
//       console.error("Error unsaving RFP:", err);
//     }
//   };

//   const handleShare = (link) => {
//     navigator.clipboard.writeText(link).then(() => {
//       alert("Link copied to clipboard!");
//     });
//   };

//   const applyFilters = (rfps) => {
//     return rfps.filter((rfp) => {
//       if (filters.fundingType && rfp.fundingType !== filters.fundingType) return false;
//       if (filters.organizationType && rfp.organizationType !== filters.organizationType) return false;
//       return true;
//     });
//   };

//   const RFPCard = ({ rfp, isSaved }) => (
//     <div className="bg-white rounded-xl p-4 shadow min-w-[300px] max-w-[320px] mr-4">
//       <div className="flex items-center gap-2">
//         <img src={rfp.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
//         <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded">{rfp.match}% Match</span>
//       </div>
//       <h3 className="font-semibold mb-1 text-gray-800 text-base">{rfp.title}</h3>
//       <p className="text-sm text-gray-600 mb-2">{rfp.description}</p>
//       <div className="text-xs text-gray-500">
//         <div><b>Budget:</b> {rfp.budget}</div>
//         <div><b>Deadline:</b> {rfp.deadline}</div>
//         <div><b>Org:</b> {rfp.organization}</div>
//       </div>
//       <div className="flex justify-between items-center mt-3">
//         <div className="flex gap-2 text-blue-600 text-lg">
//           {isSaved ? (
//             <MdBookmark onClick={() => handleUnsave(rfp.id)} className="cursor-pointer" />
//           ) : (
//             <FaRegBookmark onClick={() => handleSave(rfp)} className="cursor-pointer" />
//           )}
//           <MdShare onClick={() => handleShare(rfp.link)} className="cursor-pointer" />
//         </div>
//         <a href={rfp.link} className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">View Details</a>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">AI Recommended RFPs</h2>
//       <div className="flex overflow-x-auto scrollbar-hide">
//         {applyFilters(recommended).map((rfp) => (
//           <RFPCard key={rfp.id} rfp={rfp} isSaved={!!saved.find((s) => s.id === rfp.id)} />
//         ))}
//       </div>

//       <h2 className="text-xl font-bold mt-10 mb-4">Recently Added RFPs</h2>
//       {applyFilters(recent).length ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {applyFilters(recent).map((rfp) => (
//             <RFPCard key={rfp.id} rfp={rfp} isSaved={!!saved.find((s) => s.id === rfp.id)} />
//           ))}
//         </div>
//       ) : <p className="text-sm text-gray-500">Oops! Nothing here.</p>}

//       <h2 className="text-xl font-bold mt-10 mb-4">Saved RFPs</h2>
//       {saved.length ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {applyFilters(saved).map((rfp) => (
//             <RFPCard key={rfp.id} rfp={rfp} isSaved={true} />
//           ))}
//         </div>
//       ) : <p className="text-sm text-gray-500">Oops! Nothing saved yet.</p>}
//     </div>
//   );
// };

// export default DiscoverRFPs;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { MdBookmark, FaRegBookmark, MdShare, FaUserCircle } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";

// const baseURL = "https://proposal-form-backend.vercel.app";

// const Navbar = () => (
//   <div className="fixed top-0 left-0 right-0 bg-white border-b shadow px-6 py-4 flex justify-between items-center z-30 h-16">
//     <div className="flex items-center gap-4">
//       <FiMenu className="text-xl" />
//       <span className="font-bold text-lg">LOGO</span>
//       <nav className="hidden md:flex gap-6 text-sm text-gray-700">
//         {["Discover", "Proposals", "Dashboard", "Profile"].map((item, i) => (
//           <a key={i} href="#" className="hover:text-blue-600">{item}</a>
//         ))}
//       </nav>
//     </div>
//     <FaUserCircle className="text-2xl text-gray-600" />
//   </div>
// );

// const Sidebar = () => (
//   <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white p-6 shadow-md overflow-y-auto z-20 hidden md:block">
//     <div className="mb-6">
//       <h2 className="text-lg font-bold text-gray-800 mb-4">Navigation</h2>
//       <ul className="space-y-2 text-sm">
//         {["Overview", "Team Details", "Proposals", "Documents", "Case Studies", "Certificates", "Settings"].map((item, i) => (
//           <li key={i} className={`hover:text-blue-600 ${item === "Overview" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>{item}</li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// const DiscoverRFPs = () => {
//   const [recommended, setRecommended] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [saved, setSaved] = useState([]);
//   const [filters, setFilters] = useState({});

//   useEffect(() => {
//     fetchRFPData();
//   }, []);

//   const fetchRFPData = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/rfps`);
//       const { recommendedRFPs, recentRFPs, savedRFPs } = res.data;
//       setRecommended(recommendedRFPs || []);
//       setRecent(recentRFPs || []);
//       setSaved(savedRFPs || []);
//     } catch (err) {
//       console.error("Error fetching RFPs:", err);
//     }
//   };

//   const handleSave = async (rfp) => {
//     try {
//       await axios.post(`${baseURL}/api/save-rfp`, { rfpId: rfp.id });
//       setSaved((prev) => [...prev, rfp]);
//     } catch (err) {
//       console.error("Error saving RFP:", err);
//     }
//   };

//   const handleUnsave = async (rfpId) => {
//     try {
//       await axios.post(`${baseURL}/api/unsave-rfp`, { rfpId });
//       setSaved((prev) => prev.filter((r) => r.id !== rfpId));
//     } catch (err) {
//       console.error("Error unsaving RFP:", err);
//     }
//   };

//   const handleShare = (link) => {
//     navigator.clipboard.writeText(link).then(() => {
//       alert("Link copied to clipboard!");
//     });
//   };

//   const applyFilters = (rfps) => {
//     return rfps.filter((rfp) => {
//       if (filters.fundingType && rfp.fundingType !== filters.fundingType) return false;
//       if (filters.organizationType && rfp.organizationType !== filters.organizationType) return false;
//       return true;
//     });
//   };

//   const RFPCard = ({ rfp, isSaved }) => (
//     <div className="bg-white rounded-xl p-4 shadow min-w-[300px] max-w-[320px] mr-4">
//       <div className="text-sm text-gray-500 mb-1">{rfp.match}% Match</div>
//       <h3 className="font-semibold mb-1 text-gray-800 text-base">{rfp.title}</h3>
//       <p className="text-sm text-gray-600 mb-2">{rfp.description}</p>
//       <div className="text-xs text-gray-500">
//         <div><b>Budget:</b> {rfp.budget}</div>
//         <div><b>Deadline:</b> {rfp.deadline}</div>
//         <div><b>Org:</b> {rfp.organization}</div>
//       </div>
//       <div className="flex justify-between items-center mt-3">
//         <div className="flex gap-2 text-blue-600 text-lg">
//           {isSaved ? (
//             <MdBookmark onClick={() => handleUnsave(rfp.id)} className="cursor-pointer" />
//           ) : (
//             <FaRegBookmark onClick={() => handleSave(rfp)} className="cursor-pointer" />
//           )}
//           <MdShare onClick={() => handleShare(rfp.link)} className="cursor-pointer" />
//         </div>
//         <a href={rfp.link} className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700" target="_blank" rel="noopener noreferrer">View Details</a>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <Sidebar />
//       <main className="pt-20 px-6 ml-0 md:ml-64">
//         <h2 className="text-xl font-bold mb-4">AI Recommended RFPs</h2>
//         <div className="flex overflow-x-auto scrollbar-hide pb-2">
//           {applyFilters(recommended).map((rfp) => (
//             <RFPCard key={rfp.id} rfp={rfp} isSaved={!!saved.find((s) => s.id === rfp.id)} />
//           ))}
//         </div>

//         <h2 className="text-xl font-bold mt-10 mb-4">Recently Added RFPs</h2>
//         {applyFilters(recent).length ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {applyFilters(recent).map((rfp) => (
//               <RFPCard key={rfp.id} rfp={rfp} isSaved={!!saved.find((s) => s.id === rfp.id)} />
//             ))}
//           </div>
//         ) : <p className="text-sm text-gray-500">Oops! Nothing here.</p>}

//         <h2 className="text-xl font-bold mt-10 mb-4">Saved RFPs</h2>
//         {saved.length ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {applyFilters(saved).map((rfp) => (
//               <RFPCard key={rfp.id} rfp={rfp} isSaved={true} />
//             ))}
//           </div>
//         ) : <p className="text-sm text-gray-500">Oops! Nothing saved yet.</p>}
//       </main>
//     </div>
//   );
// };

// export default DiscoverRFPs;




import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRegBookmark,
  FaUserCircle,
} from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import { MdShare, MdBookmark } from "react-icons/md";

// Navbar Component
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 z-50">
    <div className="flex items-center gap-4">
      <span className="font-bold text-xl">LOGO</span>
      <div className="hidden md:flex gap-6 text-sm ml-6">
        {["Discover", "Proposals", "Dashboard", "Profile"].map((item, i) => (
          <a key={i} href="#" className="hover:text-blue-600 text-gray-700">
            {item}
          </a>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-4">
      <FiSearch className="text-lg" />
      <FiBell className="text-lg" />
      <FaUserCircle className="text-2xl text-gray-700" />
    </div>
  </nav>
);

// Sidebar Component
const LeftSidebar = ({ isOpen, onClose, filters, setFilters, searchQuery, setSearchQuery }) => {
  const categories = {
    fundingType: ["Infrastructure", "Education", "Healthcare", "Research & Development"],
    organizationType: ["Government", "Non-Profit", "Education", "Private Sector"],
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
      <input
        type="text"
        placeholder="Search RFPs"
        className="w-full p-2 mb-6 border rounded-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {Object.entries(categories).map(([category, values]) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
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
              <label>{value}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)]">
        {content}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={onClose}
          />
          <div className="fixed top-0 left-0 z-40 bg-white w-64 h-full shadow-lg p-4">
            <div className="text-right mb-4">
              <button onClick={onClose} className="text-sm text-blue-600">
                Close
              </button>
            </div>
            {content}
          </div>
        </>
      )}
    </>
  );
};

// Main Component
const DiscoverRFPs = () => {
  const [filters, setFilters] = useState({ fundingType: [], organizationType: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [saved, setSaved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRFPs = async () => {
        try {
            const res = await axios.get("https://your-backend-url.com/api/rfp/getallRfp");
            const { recommendedRFPs, recentRFPs, savedRFPs } = res.data;

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
        }
    };

    fetchRFPs();
  }, []);

  const applyFilters = (rfps) => {
    return rfps.filter((rfp) => {
      const queryMatch =
        rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfp.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!queryMatch) return false;

      if (
        filters.fundingType.length &&
        !filters.fundingType.includes(rfp.fundingType)
      )
        return false;

      if (
        filters.organizationType.length &&
        !filters.organizationType.includes(rfp.organizationType)
      )
        return false;

      return true;
    });
  };

  const handleSave = (rfp) => {
    setSaved((prev) => [...prev, rfp]);
  };

  const handleUnsave = (rfpId) => {
    setSaved((prev) => prev.filter((r) => r.id !== rfpId));
  };

  const handleShare = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const RFPCard = ({ rfp, isSaved }) => (
    <div className="bg-[#F8FAFC] rounded-xl p-4 shadow w-[355px] mr-4 ">
      <div className="flex items-center justify-between mb-2">
        <img src={rfp.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
        <span className="text-[10px] text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
          {rfp.match}% Match
        </span>
      </div>
      <h3 className="font-semibold text-[#111827] text-[18px] mb-1">{rfp.title}</h3>
      <p className="text-[16px] text-[#4B5563] mb-2">{rfp.description}</p>
      <div className="text-[14px] text-[#4B5563CC] space-y-1">
        <div>💰 {rfp.budget}</div>
        <div>⏰ Deadline: {rfp.deadline}</div>
        <div>🏢 Org: {rfp.organization}</div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-3 text-[#111827] text-lg">
          {isSaved ? (
            <MdBookmark onClick={() => handleUnsave(rfp.id)} className="cursor-pointer" title="Unsave" />
          ) : (
            <FaRegBookmark onClick={() => handleSave(rfp)} className="cursor-pointer" title="Save" />
          )}
          <MdShare onClick={() => handleShare(rfp.link)} className="cursor-pointer" title="Share" />
        </div>
        <a
          href={rfp.link}
          className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Details
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3E6FF]">
      <Navbar />
      <LeftSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="pt-20 px-6 py-6 ml-0 lg:ml-64">
        {/* Search & Filter UI */}
        <div className="lg:hidden flex justify-end mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-sm text-white bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17V13.414L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">AI Recommended RFPs</h2>
        <div className="flex overflow-x-auto pb-2 custom-scroll">
          {applyFilters(recommended).map((rfp) => (
            <RFPCard
              key={rfp.id}
              rfp={rfp}
              isSaved={!!saved.find((s) => s.id === rfp.id)}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold mt-10 mb-4">Recently Added RFPs</h2>
        <div className="flex overflow-x-auto pb-2 custom-scroll">
          {applyFilters(recent).map((rfp) => (
            <RFPCard
              key={rfp.id}
              rfp={rfp}
              isSaved={!!saved.find((s) => s.id === rfp.id)}
            />
          ))}
        </div>


        <h2 className="text-xl font-bold mt-10 mb-4">Saved RFPs</h2>
        {saved.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {saved.map((rfp) => (
              <RFPCard key={rfp.id} rfp={rfp} isSaved={true} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Oops! Nothing here. Discover & save some RFPs to view them!</p>
        )}
      </main>
    </div>
  );
};

export default DiscoverRFPs;

