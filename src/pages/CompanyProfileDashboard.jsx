import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineEdit, MdOutlineSearch, MdOutlineNotifications, MdOutlineAddAPhoto, MdOutlineBusinessCenter, MdOutlineHome, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineGroups, MdOutlineDocumentScanner, MdOutlineFolder, MdOutlineAssignment, MdOutlineLightMode, MdOutlineSettings, MdOutlineDownload,  MdOutlineOpenInNew  } from "react-icons/md";

// Reusable Badge
const StatusBadge = ({ status }) => {
  const statusStyles = {
    "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
    "Won": "bg-[#DCFCE7] text-[#15803D]",
    "Submitted": "bg-gray-100 text-gray-700",
    "Rejected": "bg-red-100 text-red-600",
    "Urgent": "bg-[#FEE2E2] text-[#DC2626]",
    "Scheduled": "bg-[#DBEAFE] text-[#2563EB]",
    "On Track": "bg-[#DCFCE7] text-[#15803D]",
    "Pending": "bg-[#FEF9C3] text-[#CA8A04]",
  };
  return (
    <span className={`px-2 py-1 text-[12px] rounded-full ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>
      {status}
    </span>
  );
};

// Navbar
const Navbar = ({ onToggle }) => (
  <div className="fixed top-0 left-0 right-0 bg-white border-b shadow px-4 sm:px-6 py-4 flex justify-between items-center z-30 h-16">
    <div className="flex items-center gap-4">
      <button className="md:hidden" onClick={onToggle}>
        <FiMenu className="text-xl" />
      </button>
      <span className="font-bold text-lg">LOGO</span>
      <nav className="hidden md:flex gap-6 text-sm text-gray-700">
        {["Discover", "Proposals", "Dashboard", "Profile"].map((item, i) => (
          <a key={i} href="#" className="hover:text-[#2563EB]">
            {item}
          </a>
        ))}
      </nav>
    </div>
    <FaUserCircle className="text-2xl text-gray-600" />
  </div>
);

// Sidebar
const Sidebar = ({ isMobile, onClose }) => (
  <div className={`fixed top-64 left-0 ${isMobile ? "w-full h-full" : "w-64 h-[calc(100vh-4rem)]"} bg-white p-6 shadow-md overflow-y-auto z-40`}>
    {isMobile && (
      <button onClick={onClose} className="block text-right w-full text-gray-600 mb-4">Close</button>
    )}
    <ul className="space-y-2 text-sm">
      {["Overview", "Team Details", "Proposals", "Documents", "Case Studies", "Certificates", "Settings"].map((item, i) => (
        <li key={i} className={`hover:text-[#2563EB] ${item === "Overview" ? "text-[#2563EB] font-semibold" : "text-gray-700"}`}>{item}</li>
      ))}
    </ul>
    <div className="mt-8 text-sm">
      <p>myname@email.com</p>
      <p>+91-5877486484</p>
      <p>www.mywebsite.com</p>
    </div>
  </div>
);

// Right Sidebar
const RightSidebar = ({ deadlines, activity, isMobile, onClose }) => {
  const content = (
    <>
      <div className="mb-4">
        <h4 className="font-semibold text-[16px] mb-4">Upcoming Deadlines</h4>
        {deadlines.map((deadline, i) => (
          <div key={i} className="flex justify-between rounded-lg items-center bg-[#F9FAFB] p-2 text-sm mb-2">
            <div className="flex flex-col">
              <span className="text-[14px] text-[#111827]">{deadline.title}</span>
              <span className="text-[11px] text-[#9CA3AF]">{deadline.date}</span>
            </div>
            <StatusBadge status={deadline.status} />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-[16px] mb-4">Recent Activity</h4>
        {activity.map((act, i) => (
          <div key={i} className="flex justify-between rounded-lg items-center bg-[#F9FAFB] p-2 text-sm mb-2">
            <div className="flex flex-col">
              <span className="text-[14px] text-[#111827]">{act.title}</span>
              <span className="text-[11px] text-[#9CA3AF]">{act.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
        <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 p-6 shadow-lg overflow-y-auto">
          <div className="text-right mb-4">
            <button onClick={onClose} className="text-gray-600 font-semibold">Close</button>
          </div>
          {content}
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:block fixed top-64 right-0 w-64 h-[calc(100vh-4rem)] bg-[#F8F9FA] p-6 shadow-md overflow-y-auto z-20">
      {content}
    </div>
  );
};


// Main Component
const CompanyProfileDashboard = () => {
  const [companyData1, setCompanyData1] = useState(null);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const companyData = {
    companyName: "ABC Company Inc.",
    industry: "Technology Solutions & Consulting",
    location: "San Francisco, CA",
    email: "myname@email.com",
    phone: "+91-5877486484",
    website: "www.mywebsite.com",
    stats: {
      totalProposals: 156,
      wonProposals: 50,
      successRate: "55%",
      activeProposals: 12,
    },
    profile: {
      bio: "ABC Company Inc. is a leading technology consulting firm specializing in digital transformation, cloud solutions and enterprise software development. With over 15 years of experience, we help businesses leverage technology to achieve their strategic objectives.",
      services: ["Cloud Architecture", "Enterprise Solutions", "Data Analytics", "Enterprise Solutions", "Data Analytics","Cloud Architecture", "Data Analytics","Cloud Architecture", "Enterprise Solutions"],
    },
    recentProposals: [
      { title: "Data Analytics Platform", date: "Jan 20, 2024", status: "In Progress" },
      { title: "Security Infrastructure", date: "Jan 20, 2024", status: "Won" },
      { title: "Enterprise Cloud Migration", date: "Jan 20, 2024", status: "Submitted" },
      { title: "We Development Site", date: "Jan 20, 2024", status: "Rejected" },
    ],
    documentLibrary: [
      { name: "Company Profile.pdf", type: "PDF", size: "2.5 MB" },
      { name: "Something.docx", type: "DOCX", size: "2.5 MB" },
    ],
    caseStudies: [
      "Future of Software Development",
      "All about AI & Technology",
      "A case study about everything",
    ],
    certifications: [
      { name: "ISO 5864", validTill: "Dec 2025" },
      { name: "ISO 5864", validTill: "Dec 2025" },
      { name: "ISO 5864", validTill: "Dec 2025" },
    ],
    deadlines: [
      { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
      { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
      { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
      { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
    ],
    activity: [
      { title: "New proposal submitted", date: "Jan 20, 2024" },
      { title: "Document updated", date: "Jan 20, 2024"},
      { title: "Team meeting scheduled", date: "Jan 20, 2024" },
    ],
  };

  return (
    <div className="min-h-screen relative">
      <Navbar onToggle={() => setIsMobileNavOpen(true)} />

      <div className="hidden md:block"><Sidebar /></div>
      {isMobileNavOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-40 z-30" onClick={() => setIsMobileNavOpen(false)}></div>
          <Sidebar isMobile onClose={() => setIsMobileNavOpen(false)} />
        </>
      )}
      
      {/* Right Sidebar: desktop */}
      <RightSidebar deadlines={companyData.deadlines} activity={companyData.activity} />

      {/* Right Sidebar: mobile drawer */}
      {showRightSidebar && (
        <RightSidebar
          isMobile
          deadlines={companyData.deadlines}
          activity={companyData.activity}
          onClose={() => setShowRightSidebar(false)}
        />
      )}

      {/* Activity button: visible only on small screens */}
      <button
        className="block lg:hidden fixed bottom-4 right-4 z-40 bg-[#2563EB] text-white px-4 py-2 rounded-full shadow"
        onClick={() => setShowRightSidebar(true)}
      >
        Activity
      </button>

      <div className="relative bg-[#F8F9FA] fixed w-full h-64 mt-0 top-[42px] left-0 z-10 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mx-12">
          <div>
            <h2 className="text-2xl font-semibold">{companyData.companyName}</h2>
            <p>{companyData.industry} | {companyData.location}</p>
            <p>{companyData.email} | {companyData.phone} | {companyData.website}</p>
          </div>
          <div className="group flex items-center gap-1 mt-4 md:mt-0">
            <MdOutlineEdit className="cursor-pointer text-[#2563EB]" />
            <button className="text-[#2563EB]" onClick={() => alert("Edit Profile-2 Clicked")}>Edit Profile</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(companyData.stats).map(([key, value]) => (
            <div key={key} className="p-4 rounded shadow text-center">
              <div className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="text-xl font-bold text-[#2563EB]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <main className="absolute pt-24 px-4 sm:px-6 pb-10 overflow-y-auto md:ml-64 lg:mr-64">
        <div className="text-gray-800">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-[24px] font-semibold mb-2">Company Profile</h3>
              <p className="text-[#4B5563] text-[16px] mb-4">{companyData.profile.bio}</p>
              <div className="flex flex-wrap gap-2">
                {companyData.profile.services.map((service, i) => (
                  <span key={i} className="text-[#6B7280] text-[15px]">{service}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-1 rounded-xl p-4">
                <h4 className="font-semibold text-[#4B5563] text-[16px] mb-2">Recent Proposals</h4>
                {companyData.recentProposals.map((proposal, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded shadow text-sm mb-2">
                    <div className="flex flex-col">
                      <span>{proposal.title}</span>
                      <span className="text-xs text-gray-500">{proposal.date}</span>
                    </div>
                    <StatusBadge status={proposal.status} />
                  </div>
                ))}
              </div>
              <div className="border border-1 rounded-xl p-4">
                <h4 className="font-semibold text-[#4B5563] text-[16px] mb-2">Document Library</h4>
                {companyData.documentLibrary.map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded shadow text-sm mb-2">
                    <div className="flex items-center gap-4">
                      <MdOutlineDocumentScanner className="text-[#2563EB] w-6 h-6" />
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        <span>({doc.type} | {doc.size})</span>
                      </div>
                    </div>
                    <button className="text-blue-500 text-xs flex items-center gap-1"><MdOutlineDownload className="text-[#2563EB] w-6 h-6" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-1 rounded-xl p-4">
                <h4 className="font-semibold text-[#4B5563] text-[16px] mb-2">Case Studies</h4>
                {companyData.caseStudies.map((study, i) => (
                  <div key={i} className="text-sm py-1 flex justify-between items-center p-2 rounded shadow mb-2">
                    <span>{study}</span>
                    <a href="#" className="text-[#2563EB] text-xs flex items-center gap-1"><MdOutlineOpenInNew className="text-[#2563EB] w-4 h-4" /></a>
                  </div>
                ))}
              </div>
              <div className="border border-1 rounded-xl p-4">
                <h4 className="font-semibold text-[#4B5563] text-[16px] mb-2">Certifications</h4>
                {companyData.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-2 items-center mb-2">
                      <MdOutlineAssignment className="text-[#2563EB] w-6 h-6" />
                      <div className="flex flex-col text-sm p-2 mb-2">
                        <p>{cert.name}</p>
                        <p className="text-xs text-gray-500">Valid Till: {cert.validTill}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfileDashboard;
