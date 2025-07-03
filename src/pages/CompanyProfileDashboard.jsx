import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineEdit, MdOutlineSearch, MdOutlineNotifications, MdOutlineAddAPhoto, MdOutlineBusinessCenter, MdOutlineHome, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineGroups, MdOutlineDocumentScanner, MdOutlineFolder, MdOutlineAssignment,MdOutlineVerifiedUser, MdOutlineLightMode, MdOutlineSettings, MdOutlineDownload,  MdOutlineOpenInNew  } from "react-icons/md";

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

const sidebarItems = [
  { name: "Overview", icon: <MdOutlineHome className="w-6 h-6" /> },
  { name: "Team Details", icon: <MdOutlineGroups className="w-6 h-6" /> },
  { name: "Proposals", icon: <MdOutlineDocumentScanner className="w-6 h-6" /> },
  { name: "Documents", icon: <MdOutlineFolder className="w-6 h-6" /> },
  { name: "Case Studies", icon: <MdOutlineAssignment className="w-6 h-6" /> },
  { name: "Certificates", icon: <MdOutlineVerifiedUser className="w-6 h-6" /> },
  { name: "Settings", icon: <MdOutlineSettings className="w-6 h-6" /> },
];

// Sidebar
const Sidebar = ({ isMobile = false, onClose = () => {}, active = "Overview", onSelect }) => (
  <div
    className={`fixed ${isMobile ? "top-0 w-64 h-full z-50" : "mt-9 w-64 h-[calc(100vh-16rem)] z-20"} left-0 bg-white shadow-md overflow-y-auto p-6`}
  >
    {isMobile && (
      <div className="text-right mb-4">
        <button onClick={onClose} className="text-gray-600 font-semibold">Close</button>
      </div>
    )}

    <ul className="space-y-1">
      {sidebarItems.map(({ name, icon }) => (
        <li
          key={name}
          className={`flex items-center gap-2 cursor-pointer px-2 py-2 rounded-lg ${
            name === active ? "text-[#2563EB] font-semibold bg-[#EFF6FF]" : "text-[#4B5563] bg-[#FFFFFF]"
          }`}
          onClick={() => {
            onSelect(name);
            if (isMobile) onClose();
          }}
        >
          <span>{icon}</span>
          <span className="font-medium text-[16px]">{name}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Right Sidebar
const RightSidebar = ({ deadlines, activity, isMobile, onClose }) => {
  const content = (
    <>
      <div className="mb-4">
        <h4 className="font-semibold text-[16px] mb-4">Upcoming Deadlines</h4>
        {deadlines.map((deadline, i) => (
          <div key={i} className="flex justify-between rounded-lg items-center bg-[#F9FAFB] p-2 mb-2">
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
          <div key={i} className="flex justify-between rounded-lg items-center bg-[#F9FAFB] p-2 mb-2">
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
    <div className="hidden lg:block fixed mt-9 right-0 w-64 h-[calc(100vh-4rem)] bg-[#F8F9FA] p-6 shadow-md overflow-y-auto z-20">
      {content}
    </div>
  );
};


// Main Component
const CompanyProfileDashboard = () => {
  const [companyData1, setCompanyData1] = useState(null);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

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
      { title: "Future of Software Development", readTime: "5 min" },
      { title: "All about AI & Technology", readTime: "4 min" },
      { title: "A case study about everything", readTime: "6 min" },
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
    <div className="h-full relative">
      <Navbar onToggle={() => setIsMobileNavOpen(true)} />

      <div className="bg-[#F8F9FA] md:fixed h-76 mt-16 md:mt-0 md:top-16 left-0 right-0 z-10 shadow-md px-12 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mx-12">
          <div className="mt-4">
            <h2 className="text-[24px] font-semibold">{companyData.companyName}</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <MdOutlineBusinessCenter className="w-5 h-5 shrink-0 text-[#4B5563]" />
                <p className="text-[14px] md:text-[16px] text-[#4B5563]">{companyData.industry}</p>
              </div>
              <p className="hidden md:inline">|</p>
              <div className="flex items-center gap-2">
                <MdOutlineLocationOn className="w-5 h-5 shrink-0 text-[#4B5563]" />
                <p className="text-[14px] md:text-[16px] text-[#4B5563]">{companyData.location}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="flex items-center gap-2">
                <MdOutlineMail className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData.email}</p>
              </div>
              <p className="hidden md:inline">|</p>
              <div className="flex items-center gap-2">
                <MdOutlineCall className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData.phone}</p>
              </div>
              <p className="hidden md:inline">|</p>
              <div className="flex items-center gap-2">
                <MdOutlineLanguage className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData.website}</p>
              </div>
            </div>
          </div>
          <div className="group flex items-center gap-1 mt-4 md:-mt-12">
            <button className="text-[#2563EB] flex items-center gap-1" onClick={() => alert("Edit Profile-2 Clicked")}><MdOutlineEdit /> Edit Profile</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(companyData.stats).map(([key, value]) => (
            <div key={key} className="p-4 rounded shadow text-left bg-[#FFFFFF]">
              <div className="text-[16px] text-[#6B7280] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="text-[24px] font-semibold text-[#2563EB]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block mt-[20rem]"><Sidebar active={activeTab} onSelect={setActiveTab} /></div>
      {isMobileNavOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-40 z-30" onClick={() => setIsMobileNavOpen(false)}></div>
          <Sidebar isMobile onClose={() => setIsMobileNavOpen(false)} active={activeTab} onSelect={setActiveTab} />
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

      {/* Activity button: visible upto medium screens */}
      <button
        className="block lg:hidden fixed bottom-4 right-4 z-40 bg-[#2563EB] text-white px-4 py-2 rounded-full shadow"
        onClick={() => setShowRightSidebar(true)}
      >
        Activity
      </button>

      <main className="flex-1 md:-mt-7 py-16 px-4 sm:px-6 pb-10 overflow-y-auto md:ml-64 lg:mr-64">
        <div className="bg-[#FFFFFF] ml-3">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-[24px] font-semibold mb-2">Company Profile</h3>
                <p className="text-[#4B5563] text-[16px] mb-4">{companyData.profile.bio}</p>
                <h3 className="font-medium text-[#111827] text-[16px] mb-2">Services</h3>
                {/* <div className="flex flex-wrap gap-2">
                  {companyData.profile.services.map((service, i) => (
                    <span key={i} className="text-[#6B7280] text-[15px]">{service}</span>
                  ))}
                </div> */}
                <ul className="columns-1 xs:columns-2 lg:columns-3 gap-4 list-disc gap-2 mt-2 ml-8">
                  {companyData.profile.services.map((service, i) => (
                    <li
                      key={i}
                      className="text-[15px] text-[#6B7280] mb-2 break-inside-avoid"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Recent Proposals</h4>
                  {companyData.recentProposals.map((proposal, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#111827]">{proposal.title}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{proposal.date}</span>
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                  ))}
                </div>
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Document Library</h4>
                  {companyData.documentLibrary.map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-2">
                      <div className="flex items-center gap-4">
                        <MdOutlineDocumentScanner className="text-[#2563EB] w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="text-[14px] text-[#111827]">{doc.name}</span>
                          <span className="text-[12px] text-[#4B5563]">({doc.type} | {doc.size})</span>
                        </div>
                      </div>
                      <button className="text-[#2563EB] text-xs flex items-center gap-1"><MdOutlineDownload className="text-[#2563EB] w-6 h-6" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Case Studies</h4>
                  {companyData.caseStudies.map((study, i) => (
                    <div key={i} className="bg-[#F9FAFB] py-1 flex justify-between items-center p-2 rounded shadow mb-2">
                      <div className="flex flex-col items-start">
                        <span className="text-[14px] text-[#111827]">{study.title}</span>
                        <span className="text-[12px] text-[#4B5563]">{study.readTime}</span>
                      </div>
                      <a href="#" className="text-[#2563EB] text-xs flex items-center gap-1"><MdOutlineOpenInNew className="text-[#2563EB] w-4 h-4" /></a>
                    </div>
                  ))}
                </div>
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Certifications</h4>
                  {companyData.certifications.map((cert, i) => (
                      <div key={i} className="flex items-center p-2 mb-2 bg-[#F9FAFB]">
                        <MdOutlineAssignment className="text-[#2563EB] w-6 h-6" />
                        <div className="flex flex-col items-start ml-2">
                          <span className="text-[14px] text-[#111827]">{cert.name}</span >
                          <span className="text-[11px] text-[#4B5563]">Valid Till: {cert.validTill}</span >
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Team Details" && (
            <div>Team details content here.</div>
          )}
          {activeTab === "Proposals" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Recent Proposals</h3>
              {companyData.recentProposals.map((p, i) => (
                <div key={i} className="mb-2 p-2 border rounded flex justify-between">
                  <span>{p.title}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
          {activeTab === "Documents" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Documents</h3>
              {companyData.documentLibrary.map((d, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>{d.name}</div>
                  <div className="text-sm text-gray-500">{d.type}, {d.size}</div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Case Studies" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Case Studies</h3>
              {companyData.caseStudies.map((cs, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>{cs}</div>
                  <MdOutlineOpenInNew />
                </div>
              ))}
            </div>
          )}
          {activeTab === "Certificates" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Certificates</h3>
              {companyData.certifications.map((c, i) => (
                <div key={i} className="mb-2">
                  {c.name} - Valid Till: {c.validTill}
                </div>
              ))}
            </div>
          )}
          {activeTab === "Settings" && (
            <div>Settings section content here.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyProfileDashboard;
