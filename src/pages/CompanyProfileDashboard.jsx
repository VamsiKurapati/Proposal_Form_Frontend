import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineEdit, MdOutlineSearch, MdOutlineNotifications, MdOutlineAddAPhoto, MdOutlineBusinessCenter, MdOutlineHome, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineGroups, MdOutlineDocumentScanner, MdOutlineFolder, MdOutlineAssignment, MdOutlineVerifiedUser, MdOutlineLightMode, MdOutlineSettings, MdOutlineDownload, MdOutlineOpenInNew, MdOutlineGroup, MdOutlineGraphicEq, MdOutlineDomain, MdOutlineCalendarToday, MdOutlineAdd } from "react-icons/md";

// Unified Badge Styles
const badgeStyles = {
  // Status badges
  "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
  "Won": "bg-[#DCFCE7] text-[#15803D]",
  "Submitted": "bg-gray-100 text-gray-700",
  "Rejected": "bg-red-100 text-red-600",
  "Urgent": "bg-[#FEE2E2] text-[#DC2626]",
  "Scheduled": "bg-[#DBEAFE] text-[#2563EB]",
  "On Track": "bg-[#DCFCE7] text-[#15803D]",
  "Pending": "bg-[#FEF9C3] text-[#CA8A04]",
  // Team member badges
  "Full Access": "bg-[#DBEAFE] text-[#2563EB]",
  "Admin": "bg-[#DCFCE7] text-[#15803D]",
  "Editor": "bg-[#FEF9C3] text-[#CA8A04]",
  "Viewer": "bg-[#F3F4F6] text-[#4B5563]",
};

// Reusable Badge
const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-[12px] rounded-full ${badgeStyles[status] || "bg-[#E5E7EB] text-gray-700"}`}>
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
const Sidebar = ({ isMobile = false, onClose = () => { }, active = "Overview", onSelect }) => (
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
          className={`flex items-center gap-2 cursor-pointer px-2 py-2 rounded-lg ${name === active ? "text-[#2563EB] font-semibold bg-[#EFF6FF]" : "text-[#4B5563] bg-[#FFFFFF]"
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
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company data from backend
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/company-profile');
        setCompanyData(getMockCompanyData());
      } catch (err) {
        setError(err.message);
        // Fallback to mock data if API fails
        setCompanyData(getMockCompanyData());
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Button handlers
  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log("Edit Profile clicked");
    // You can add navigation logic here
    // navigate('/edit-profile');
  };

  const handleDownloadDocument = (document) => {
    console.log("Downloading document:", document.name);
    // Add download logic here
    // window.open(document.downloadUrl, '_blank');
  };

  const handleReadCaseStudy = (caseStudy) => {
    console.log("Reading case study:", caseStudy.title);
    // Add navigation logic here
    // navigate(`/case-studies/${caseStudy.id}`);
  };

  const handleAddTeamMember = () => {
    console.log("Add team member clicked");
    // Add modal or navigation logic here
  };

  const handleViewProfile = (member) => {
    console.log("View profile for:", member.name);
    // Add navigation logic here
  };

  const handleContactMember = (member) => {
    console.log("Contact member:", member.name);
    // Add contact logic here (email, phone, etc.)
  };

  const handleSearchProposals = (searchTerm) => {
    console.log("Searching proposals:", searchTerm);
    // Add search logic here
  };

  const handleNewProposal = () => {
    console.log("Create new proposal");
    // Add navigation logic here
    // navigate('/create-proposal');
  };

  const handleAddCaseStudy = () => {
    console.log("Add case study");
    // Add modal or navigation logic here
  };

  const handleAddCertification = () => {
    console.log("Add certification");
    // Add modal or navigation logic here
  };

  // Mock data function for fallback
  const getMockCompanyData = () => ({
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
      services: ["Cloud Architecture", "Enterprise Solutions", "Data Analytics", "Enterprise Solutions", "Data Analytics", "Cloud Architecture", "Data Analytics", "Cloud Architecture", "Enterprise Solutions"],
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
      {
        name: "GDPR Compliant",
        issuer: "European Commission",
        validTill: "Dec 2025",
      },
      {
        name: "Financial Planning Certificate",
        issuer: "Barone LLC.",
        validTill: "Dec 2025",
      },
      {
        name: "Training Certificate",
        issuer: "Barone LLC.",
        validTill: "Dec 2025",
      },
      {
        name: "CPR Certification",
        issuer: "Abstergo Ltd.",
        validTill: "Dec 2025",
      },
      {
        name: "Certificate of Completion",
        issuer: "Acme Co.",
        validTill: "Dec 2025",
      },
      {
        name: "Leadership Certificate",
        issuer: "Biffco Enterprises Ltd.",
        validTill: "Dec 2025",
      },
      {
        name: "Fitness Instructor Certification",
        issuer: "Big Kahuna Burger Ltd.",
        validTill: "Dec 2025",
      },
      {
        name: "Certificate of Achievement",
        issuer: "Binford Ltd.",
        validTill: "Dec 2025",
      },
    ],
    deadlines: [
      { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
      { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
      { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
      { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
    ],
    activity: [
      { title: "New proposal submitted", date: "Jan 20, 2024" },
      { title: "Document updated", date: "Jan 20, 2024" },
      { title: "Team meeting scheduled", date: "Jan 20, 2024" },
    ],
    companyDetails: {
      "No.of employees": { value: 156, icon: <MdOutlineGroup className="w-6 h-6 shrink-0 text-[#2563EB]" /> },
      "Team Size": { value: 10, icon: <MdOutlineGraphicEq className="w-6 h-6 shrink-0 text-[#2563EB]" /> },
      "Department": { value: 16, icon: <MdOutlineDomain className="w-6 h-6 shrink-0 text-[#2563EB]" /> },
      "Founded": { value: 2000, icon: <MdOutlineCalendarToday className="w-6 h-6 shrink-0 text-[#2563EB]" /> },
    },
    teamDetails: [
      { name: "John Doe", position: "CEO", email: "john.doe@example.com", phone: "+1234567890", website: "www.john.com" },
      { name: "Jane Smith", position: "CTO", email: "jane.smith@example.com", phone: "+1234567890", website: "www.jane.com" },
      { name: "Mike Johnson", position: "CFO", email: "mike.johnson@example.com", phone: "+1234567890", website: "www.mike.com" },
    ],
    // Consolidated data from separate arrays
    teamMembers: [
      { name: "Sara Johnson", role: "CEO & Founder", badge: "Full Access" },
      { name: "Darrell Steward", role: "President of Sales", badge: "Admin" },
      { name: "Cody Fisher", role: "Medical Assistant", badge: "Admin" },
      { name: "Eleanor Pena", role: "Medical Assistant", badge: "Editor" },
      { name: "Theresa Webb", role: "Medical Assistant", badge: "Editor" },
      { name: "Bessie Cooper", role: "Web Designer", badge: "Editor" },
      { name: "Darrell Steward", role: "Dog Trainer", badge: "Editor" },
      { name: "Jane Cooper", role: "Dog Trainer", badge: "Editor" },
      { name: "Leslie Alexander", role: "Nursing Assistant", badge: "Editor" },
      { name: "Ralph Edwards", role: "Dog Trainer", badge: "Viewer" },
      { name: "Cody Fisher", role: "President of Sales", badge: "Viewer" },
      { name: "Devon Lane", role: "Web Designer", badge: "Viewer" },
    ],
    proposalList: [
      { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
      { title: "Social Media Proposal", company: "GlobalTech Corp", status: "Rejected", date: "Jan 20, 2026", amount: 200000 },
      { title: "Something Proposal", company: "GlobalTech Corp", status: "Won", date: "Jan 20, 2026", amount: 200000 },
      { title: "Web Development Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
      { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
      { title: "Something Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
      { title: "Web Development Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
      { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "Won", date: "Jan 20, 2026", amount: 200000 },
      { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
      { title: "Social Media Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
    ],
    documentList: [
      { name: "A_Journey_Through_Love.pdf", type: "PDF", size: "578 KB", lastModified: "Jan 15, 2026" },
      { name: "Unlocking_the_Secrets.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026" },
      { name: "The_Mysteries_of_the_Unknown.pdf", type: "PDF", size: "578 KB", lastModified: "Jan 15, 2026" },
      { name: "Mastering_Your_Personal_Finances.pdf", type: "PDF", size: "4 MB", lastModified: "Jan 15, 2026" },
      { name: "Treasured_Family_Favorites.pdf", type: "PDF", size: "2.3 MB", lastModified: "Jan 15, 2026" },
      { name: "Ultimate_Dream_Vacation.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026" },
      { name: "Exploring_World_History.pdf", type: "PDF", size: "1.4 MB", lastModified: "Jan 15, 2026" },
      { name: "The_Great_Artistic_Masters.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026" },
      { name: "Comprehensive_Financial_Planning.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026" },
      { name: "Exploring_Unknown_Worlds.pdf", type: "PDF", size: "4 MB", lastModified: "Jan 15, 2026" },
      { name: "All-Encompassing_Residency.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026" },
      { name: "The_Wonders_of_Nature.pdf", type: "PDF", size: "2 MB", lastModified: "Jan 15, 2026" },
      { name: "Inspiration_and_Creativity.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026" },
      { name: "The_Academic_Journey.pdf", type: "PDF", size: "2.3 MB", lastModified: "Jan 15, 2026" },
    ],
    caseStudiesList: [
      {
        title: "Future of Software Development",
        company: "Asiberg Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "The More Important the Work, the More Important the Rest",
        company: "Big Kahuna Burger Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "Any mechanical keyboard enthusiasts in design?",
        company: "Barone LLC.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "How to design a product that can grow its feature set",
        company: "Acme Co.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "Understanding color theory: the color wheel and finding complementary colors",
        company: "Asiberg Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "Yo Reddit! What's a small thing that anyone can do at nearly any time to make their day better?",
        company: "Binford Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "Understanding color theory: the color wheel and finding complementary colors",
        company: "Binford Enterprises Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
      {
        title: "Any mechanical keyboard enthusiasts in design?",
        company: "Binford Enterprises Ltd.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=400&q=80",
        link: "#"
      },
    ],
  });

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading company profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !companyData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading company profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <Navbar onToggle={() => setIsMobileNavOpen(true)} />

      <div className="bg-[#F8F9FA] md:fixed h-76 mt-16 md:mt-0 md:top-16 left-0 right-0 z-10 shadow-md px-12 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-3">
            <div className="flex flex-col items-center justify-center">
              <div className="w-[120px] h-[120px] bg-[#E0E0E0] rounded-lg flex items-center justify-center mb-2">
                <MdOutlineAddAPhoto className="w-6 h-6 text-[#6B7280]" />
              </div>
            </div>
            <div className="md:mr-12">
              <h2 className="text-[24px] font-semibold mb-2">{companyData?.companyName || 'Loading...'}</h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <MdOutlineBusinessCenter className="w-5 h-5 shrink-0 text-[#4B5563]" />
                  <p className="text-[14px] md:text-[16px] text-[#4B5563]">{companyData?.industry || 'Loading...'}</p>
                </div>
                <p className="hidden md:inline">|</p>
                <div className="flex items-center gap-2">
                  <MdOutlineLocationOn className="w-5 h-5 shrink-0 text-[#4B5563]" />
                  <p className="text-[14px] md:text-[16px] text-[#4B5563]">{companyData?.location || 'Loading...'}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <div className="flex items-center gap-2">
                  <MdOutlineMail className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData?.email || 'Loading...'}</p>
                </div>
                <p className="hidden md:inline">|</p>
                <div className="flex items-center gap-2">
                  <MdOutlineCall className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData?.phone || 'Loading...'}</p>
                </div>
                <p className="hidden md:inline">|</p>
                <div className="flex items-center gap-2">
                  <MdOutlineLanguage className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[14px] md:text-[16px] text-[#6B7280]">{companyData?.website || 'Loading...'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="group -mt-28 flex items-center gap-1">
            <button
              className="text-[#2563EB] text-[16px] flex items-center gap-1 hover:bg-[#EFF6FF] px-3 py-2 rounded-lg transition-colors"
              onClick={() => handleEditProfile()}
            >
              <MdOutlineEdit className="w-5 h-5 shrink-0" /> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {companyData?.stats && Object.entries(companyData.stats).map(([key, value]) => (
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
      <RightSidebar deadlines={companyData?.deadlines || []} activity={companyData?.activity || []} />

      {/* Right Sidebar: mobile drawer */}
      {showRightSidebar && (
        <RightSidebar
          isMobile
          deadlines={companyData?.deadlines || []}
          activity={companyData?.activity || []}
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
                <p className="text-[#4B5563] text-[16px] mb-4">{companyData?.profile?.bio || 'Loading...'}</p>
                <h3 className="font-medium text-[#111827] text-[16px] mb-2">Services</h3>
                {/* <div className="flex flex-wrap gap-2">
                  {companyData?.profile?.services?.map((service, i) => (
                    <span key={i} className="text-[#6B7280] text-[15px]">{service}</span>
                  ))}
                </div> */}
                <ul className="columns-1 xs:columns-2 lg:columns-3 gap-4 list-disc gap-2 mt-2 ml-8">
                  {companyData?.profile?.services?.map((service, i) => (
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
                  {companyData?.recentProposals?.map((proposal, i) => (
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
                  {companyData?.documentLibrary?.map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-2">
                      <div className="flex items-center gap-4">
                        <MdOutlineDocumentScanner className="text-[#2563EB] w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="text-[14px] text-[#111827]">{doc.name}</span>
                          <span className="text-[12px] text-[#4B5563]">({doc.type} | {doc.size})</span>
                        </div>
                      </div>
                      <button
                        className="text-[#2563EB] text-xs flex items-center gap-1 hover:bg-[#EFF6FF] rounded-full p-1 transition-colors"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <MdOutlineDownload className="text-[#2563EB] w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Case Studies</h4>
                  {companyData?.caseStudies?.map((study, i) => (
                    <div key={i} className="bg-[#F9FAFB] py-1 flex justify-between items-center p-2 rounded shadow mb-2">
                      <div className="flex flex-col items-start">
                        <span className="text-[14px] text-[#111827]">{study.title}</span>
                        <span className="text-[12px] text-[#4B5563]">{study.readTime}</span>
                      </div>
                      <button
                        className="text-[#2563EB] text-xs flex items-center gap-1 hover:bg-[#EFF6FF] rounded-full p-1 transition-colors"
                        onClick={() => handleReadCaseStudy(study)}
                      >
                        <MdOutlineOpenInNew className="text-[#2563EB] w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Certifications</h4>
                  {companyData?.certifications?.map((cert, i) => (
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
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-[24px] font-semibold mb-2">About Company</h3>
                <p className="text-[#4B5563] text-[16px] mb-4">{companyData?.profile?.bio || 'Loading...'}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {companyData?.companyDetails && Object.entries(companyData.companyDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-2">
                      <div className="flex flex-col items-start">
                        <div className="flex flex-row items-center gap-2">
                          <span>{value.icon}</span>
                          <span className="text-[12px] md:text-[14px] text-[#6B7280]">{key}</span>
                        </div>
                        <span className="text-[20px] text-[#111827] font-medium">{value.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Team Members Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[20px] font-semibold">Team Members</h3>
                    <button
                      className="flex items-center gap-1 text-[#2563EB] font-medium text-[16px] hover:bg-[#EFF6FF] px-3 py-2 rounded-lg transition-colors"
                      onClick={handleAddTeamMember}
                    >
                      <MdOutlineAdd className="w-6 h-6 shrink-0" />Add Member
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {companyData?.teamMembers?.map((member, i) => (
                      <div key={i} className="rounded-xl shadow bg-[#F9FAFB] p-4 flex flex-col gap-2 items-start">
                        <span className={`px-2 py-1 text-[12px] rounded-full font-medium ${badgeStyles[member.badge]}`}>{member.badge}</span>
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              member.name.split(' ').map(n => n[0]).join('')
                            )}
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="font-medium text-[16px] text-[#111827]">{member.name}</span>
                            <span className="text-[14px] text-[#4B5563]">{member.role}</span>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2 mx-auto">
                          <button
                            onClick={() => handleViewProfile(member)}
                            className="text-[#2563EB] text-[15px] hover:underline transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleContactMember(member)}
                            className="text-[#2563EB] text-[15px] hover:underline transition-colors"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Proposals" && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-[24px] font-semibold mb-2">Proposals</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-1 gap-4 sm:justify-end items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search proposals"
                      className="w-full md:w-1/2 border border-[#E5E7EB] rounded-lg px-4 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] pl-10"
                      onChange={(e) => handleSearchProposals(e.target.value)}
                    />
                    <MdOutlineSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                  </div>
                  <button
                    className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium text-[15px] shadow hover:bg-[#1d4ed8] transition-colors"
                    onClick={handleNewProposal}
                  >
                    <MdOutlineAdd className="w-6 h-6 shrink-0" /> New Proposal
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 lg:gap-6">
                {companyData?.proposalList?.map((proposal, i) => (
                  <div key={i} className="relative bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
                    <span className={`absolute top-4 right-4 px-2 py-1 text-xs rounded-full font-medium ${badgeStyles[proposal.status]}`}>{proposal.status}</span>
                    <div className="font-semibold text-[16px] text-[#111827] mb-1 truncate">{proposal.title}</div>
                    <div className="text-[14px] text-[#6B7280] mb-1 truncate">{proposal.company}</div>
                    <div className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-1">
                      <MdOutlineCalendarToday className="w-4 h-4 text-[#9CA3AF]" />
                      <span>{proposal.date}</span>
                    </div>
                    <div className="font-semibold text-[#2563EB] text-[17px] mt-2">$ {proposal.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Documents" && (
            <div className="bg-white rounded-xl p-2">
              <h2 className="text-[24px] font-semibold mb-6">Company Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg: gap-4 gap-y-8">
                {companyData?.documentList?.map((doc, i) => (
                  <div key={i} className="flex flex-col bg-[#F9FAFB] rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#111827] text-[14px] truncate max-w-[140px] min-w-0" title={doc.name}>{doc.name}</span>
                          <span className="text-[11px] text-[#4B5563]">{doc.type}, {doc.size}</span>
                        </div>
                      </div>
                      <button
                        className="text-[#2563EB] hover:bg-[#EFF6FF] rounded-full p-1 shrink-0 transition-colors"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <MdOutlineDownload className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#4B5563]">
                      <span>Last modified: {doc.lastModified}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Case Studies" && (
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[24px] font-semibold">Case Studies</h2>
                <button
                  className="flex items-center gap-1 text-[#2563EB] font-medium border border-[#2563EB] px-3 py-1 rounded-lg text-[15px] hover:bg-[#EFF6FF] transition-colors"
                  onClick={handleAddCaseStudy}
                >
                  <MdOutlineAdd className="w-5 h-5" /> Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companyData?.caseStudiesList?.map((cs, i) => (
                  <div key={i} className="bg-[#F9FAFB] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
                    <img src={cs.image} alt={cs.title} className="w-full h-36 object-cover rounded-t-xl" />
                    <div className="flex-1 flex flex-col p-4">
                      <div className="font-medium text-[#111827] text-[15px] truncate mb-1" title={cs.title}>{cs.title}</div>
                      <div className="text-[13px] text-[#6B7280] mb-1 truncate">{cs.company}</div>
                      <div className="text-[12px] text-[#9CA3AF] mb-2">{cs.readTime}</div>
                      <button
                        onClick={() => handleReadCaseStudy(cs)}
                        className="text-[#2563EB] text-[14px] flex items-center gap-1 mt-auto hover:underline transition-colors"
                      >
                        Read Case Study <MdOutlineOpenInNew className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Certificates" && (
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[24px] font-semibold">Certifications</h2>
                <button
                  className="flex items-center gap-1 border border-[#2563EB] text-[#2563EB] px-4 py-2 rounded-lg font-medium text-[15px] hover:bg-[#EFF6FF] transition-colors"
                  onClick={handleAddCertification}
                >
                  <MdOutlineAdd className="w-5 h-5" /> Add
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border border-[#E5E7EB] rounded-lg p-4 bg-[#FFFFFF] hover:shadow transition-shadow"
                  >
                    <MdOutlineVerifiedUser className="text-[#2563EB] w-6 h-6 mt-1" />
                    <div>
                      <div className="font-semibold text-[16px] text-[#111827]">{cert.name}</div>
                      <div className="font-medium text-[13px] text-[#4B5563]">{cert.issuer}</div>
                      <div className="text-[11px] text-[#6B7280] mt-1">Valid till: {cert.validTill}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Settings" && (
            <div>Settings section content here.</div>
          )}
        </div>
      </main>
    </div >
  );
};

export default CompanyProfileDashboard;
