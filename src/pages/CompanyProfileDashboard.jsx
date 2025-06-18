// // // import { useState } from "react";
// // // import { FaEnvelope, FaPhoneAlt, FaGlobe, FaEdit } from "react-icons/fa";
// // // import { BsCheckCircle, BsClock, BsExclamationCircle, BsXCircle } from "react-icons/bs";
// // // import { AiOutlineDownload } from "react-icons/ai";

// // // const CompanyProfileDashboard = () => {
// // //   return (
// // //     <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
// // //       {/* Header */}
// // //       <div className="flex items-center gap-6">
// // //         <div className="w-20 h-20 bg-gray-300 rounded-full" />
// // //         <div className="flex flex-col">
// // //           <h2 className="text-2xl font-bold">ABC Company Inc.</h2>
// // //           <span className="text-sm">Technology Solutions & Consulting | San Francisco, CA</span>
// // //           <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
// // //             <FaEnvelope /> myname@email.com
// // //             <FaPhoneAlt /> +91-5877486484
// // //             <FaGlobe /> www.mywebsite.com
// // //           </div>
// // //         </div>
// // //         <button className="ml-auto text-blue-600 flex items-center gap-1"><FaEdit /> Edit Profile</button>
// // //       </div>

// // //       {/* Stats */}
// // //       <div className="grid grid-cols-4 gap-6 mt-6">
// // //         {[
// // //           { label: "Total Proposals", value: 156 },
// // //           { label: "Won Proposals", value: 50 },
// // //           { label: "Success Rates", value: "55%" },
// // //           { label: "Active Proposals", value: 12 },
// // //         ].map((stat, i) => (
// // //           <div key={i} className="bg-white p-4 rounded-md shadow text-center">
// // //             <p className="text-gray-500 text-sm">{stat.label}</p>
// // //             <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <div className="grid grid-cols-12 gap-8 mt-10">
// // //         {/* Sidebar */}
// // //         <div className="col-span-2">
// // //           <ul className="space-y-2">
// // //             {["Overview", "Team Details", "Proposals", "Documents", "Case Studies", "Certificates", "Settings"].map((item) => (
// // //               <li
// // //                 key={item}
// // //                 className="px-3 py-2 rounded hover:bg-blue-100 cursor-pointer text-sm font-medium"
// // //               >
// // //                 {item}
// // //               </li>
// // //             ))}
// // //           </ul>

// // //           <div className="mt-10 text-sm text-gray-600 space-y-2">
// // //             <div className="flex items-center gap-2"><FaEnvelope /> myname@email.com</div>
// // //             <div className="flex items-center gap-2"><FaPhoneAlt /> +91-5877486484</div>
// // //             <div className="flex items-center gap-2"><FaGlobe /> www.mywebsite.com</div>
// // //           </div>
// // //         </div>

// // //         {/* Main Section */}
// // //         <div className="col-span-7 space-y-6">
// // //           <div>
// // //             <h3 className="font-semibold text-lg mb-1">Company Profile</h3>
// // //             <p className="text-sm text-gray-600 mb-2">
// // //               ABC Company Inc. is a leading technology consulting firm... (truncated). With over 15 years of experience...
// // //             </p>
// // //             <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
// // //               {["Cloud Architecture", "Enterprise Solutions", "Data Analytics"]
// // //                 .map((s, i) => <div key={i} className="bg-blue-50 p-2 rounded">{s}</div>)}
// // //             </div>
// // //           </div>

// // //           {/* Proposals */}
// // //           <div>
// // //             <h4 className="font-semibold mb-2">Recent Proposals</h4>
// // //             <div className="space-y-2 text-sm">
// // //               {[
// // //                 { name: "Data Analytics Platform", status: "In Progress" },
// // //                 { name: "Security Infrastructure", status: "Won" },
// // //                 { name: "Enterprise Cloud Migration", status: "Submitted" },
// // //                 { name: "We Development Site", status: "Rejected" },
// // //               ].map(({ name, status }, idx) => (
// // //                 <div key={idx} className="flex justify-between p-2 bg-white rounded shadow">
// // //                   <span>{name}</span>
// // //                   <span className={`text-xs px-2 py-1 rounded-full ${
// // //                     status === "In Progress" ? "bg-blue-100 text-blue-600" :
// // //                     status === "Won" ? "bg-green-100 text-green-600" :
// // //                     status === "Submitted" ? "bg-gray-100 text-gray-700" :
// // //                     "bg-red-100 text-red-600"}`}>{status}</span>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Document Library */}
// // //           <div>
// // //             <h4 className="font-semibold mb-2">Document Library</h4>
// // //             <div className="space-y-2 text-sm">
// // //               {["Company Profile.pdf", "Something.docx"].map((doc, idx) => (
// // //                 <div key={idx} className="flex justify-between items-center p-2 bg-white rounded shadow">
// // //                   <span>{doc}</span>
// // //                   <button><AiOutlineDownload size={16} /></button>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Case Studies */}
// // //           <div>
// // //             <h4 className="font-semibold mb-2">Case Studies</h4>
// // //             <div className="grid grid-cols-2 gap-2 text-sm">
// // //               {["Future of Software Development", "All about AI", "Case study about everything"]
// // //                 .map((title, i) => (
// // //                   <div key={i} className="p-3 bg-white rounded shadow flex justify-between items-center">
// // //                     <span>{title}</span>
// // //                     <a className="text-blue-500 underline" href="#">Read</a>
// // //                   </div>
// // //                 ))}
// // //             </div>
// // //           </div>

// // //           {/* Certifications */}
// // //           <div>
// // //             <h4 className="font-semibold mb-2">Certifications</h4>
// // //             <div className="grid grid-cols-2 gap-2 text-sm">
// // //               {["ISO 5864", "ISO 9001"].map((cert, i) => (
// // //                 <div key={i} className="p-3 bg-white rounded shadow">
// // //                   <div className="font-medium">{cert}</div>
// // //                   <div className="text-xs text-gray-500">Valid: Dec 2025</div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Right Section */}
// // //         <div className="col-span-3 space-y-6">
// // //           <div>
// // //             <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
// // //             <ul className="text-sm space-y-2">
// // //               {[
// // //                 { label: "Client Presentation", status: "Urgent" },
// // //                 { label: "Proposal Review", status: "Scheduled" },
// // //                 { label: "Team Meeting", status: "On Track" },
// // //                 { label: "Review Session", status: "Pending" },
// // //               ].map(({ label, status }, i) => (
// // //                 <li key={i} className="flex justify-between bg-white p-2 rounded shadow">
// // //                   <span>{label}</span>
// // //                   <span className={`text-xs px-2 py-1 rounded-full ${
// // //                     status === "Urgent" ? "bg-red-100 text-red-600" :
// // //                     status === "Scheduled" ? "bg-blue-100 text-blue-600" :
// // //                     status === "On Track" ? "bg-green-100 text-green-600" :
// // //                     "bg-yellow-100 text-yellow-600"}`}>{status}</span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </div>

// // //           <div>
// // //             <h4 className="font-semibold mb-2">Recent Activity</h4>
// // //             <ul className="text-sm space-y-2">
// // //               {[
// // //                 "New proposal submitted",
// // //                 "Document updated",
// // //                 "Team meeting scheduled"
// // //               ].map((activity, idx) => (
// // //                 <li key={idx} className="bg-white p-2 rounded shadow">{activity}</li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CompanyProfileDashboard;


// // import React from "react";

// // const companyData = {
// //   companyName: "ABC Company Inc.",
// //   industry: "Technology Solutions & Consulting",
// //   location: "San Francisco, CA",
// //   email: "myname@email.com",
// //   phone: "+91-5877486484",
// //   website: "www.mywebsite.com",
// //   stats: {
// //     totalProposals: 156,
// //     wonProposals: 50,
// //     successRate: "55%",
// //     activeProposals: 12,
// //   },
// //   profile: {
// //     bio: "ABC Company Inc. is a leading technology consulting firm specializing in digital transformation, cloud solutions and enterprise software development. With over 15 years of experience, we help businesses leverage technology to achieve their strategic objectives.",
// //     services: [
// //       "Cloud Architecture",
// //       "Enterprise Solutions",
// //       "Data Analytics",
// //     ],
// //   },
// //   recentProposals: [
// //     { title: "Data Analytics Platform", date: "Jan 20, 2024", status: "In Progress" },
// //     { title: "Security Infrastructure", date: "Jan 20, 2024", status: "Won" },
// //     { title: "Enterprise Cloud Migration", date: "Jan 20, 2024", status: "Submitted" },
// //     { title: "We Development Site", date: "Jan 20, 2024", status: "Rejected" },
// //   ],
// //   documentLibrary: [
// //     { name: "Company Profile.pdf", type: "PDF", size: "2.5 MB" },
// //     { name: "Something.docx", type: "DOCX", size: "2.5 MB" },
// //   ],
// //   caseStudies: [
// //     "Future of Software Development",
// //     "All about AI & Technology",
// //     "A case study about everything",
// //   ],
// //   certifications: [
// //     { name: "ISO 5864", validTill: "Dec 2025" },
// //     { name: "ISO 5864", validTill: "Dec 2025" },
// //     { name: "ISO 5864", validTill: "Dec 2025" },
// //   ],
// //   deadlines: [
// //     { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
// //     { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
// //     { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
// //     { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
// //   ],
// //   activity: [
// //     "New proposal submitted",
// //     "Document updated",
// //     "Team meeting scheduled",
// //   ],
// // };

// // const CompanyProfileDashboard = () => {
// //   return (
// //     <div className="p-8 text-gray-800">
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
// //         <div>
// //           <h2 className="text-2xl font-semibold">{companyData.companyName}</h2>
// //           <p>{companyData.industry} | {companyData.location}</p>
// //           <p>{companyData.email} | {companyData.phone} | {companyData.website}</p>
// //         </div>
// //         <button className="text-blue-600 hover:underline">Edit Profile</button>
// //       </div>

// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// //         {Object.entries(companyData.stats).map(([key, value]) => (
// //           <div key={key} className="bg-gray-100 p-4 rounded shadow text-center">
// //             <div className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
// //             <div className="text-xl font-bold text-blue-600">{value}</div>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <div className="md:col-span-2">
// //           <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
// //           <p className="mb-4">{companyData.profile.bio}</p>
// //           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //             {companyData.profile.services.map((service, i) => (
// //               <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{service}</span>
// //             ))}
// //           </div>

// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <h4 className="font-semibold mb-2">Recent Proposals</h4>
// //               {companyData.recentProposals.map((proposal, i) => (
// //                 <div key={i} className="flex justify-between text-sm py-1">
// //                   <span>{proposal.title}</span>
// //                   <span className="text-gray-500">{proposal.status}</span>
// //                 </div>
// //               ))}
// //             </div>
// //             <div>
// //               <h4 className="font-semibold mb-2">Document Library</h4>
// //               {companyData.documentLibrary.map((doc, i) => (
// //                 <div key={i} className="text-sm py-1">
// //                   {doc.name} ({doc.type} | {doc.size})
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <h4 className="font-semibold mb-2">Case Studies</h4>
// //               {companyData.caseStudies.map((study, i) => (
// //                 <div key={i} className="text-sm py-1 flex justify-between items-center">
// //                   <span>{study}</span>
// //                   <span className="text-blue-600 text-xs cursor-pointer">↗</span>
// //                 </div>
// //               ))}
// //             </div>
// //             <div>
// //               <h4 className="font-semibold mb-2">Certifications</h4>
// //               {companyData.certifications.map((cert, i) => (
// //                 <div key={i} className="text-sm py-1">
// //                   {cert.name} - Valid: {cert.validTill}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="md:col-span-1 space-y-6">
// //           <div>
// //             <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
// //             {companyData.deadlines.map((deadline, i) => (
// //               <div key={i} className="text-sm py-1 flex justify-between">
// //                 <span>{deadline.title}</span>
// //                 <span className="text-xs text-gray-500">{deadline.status}</span>
// //               </div>
// //             ))}
// //           </div>
// //           <div>
// //             <h4 className="font-semibold mb-2">Recent Activity</h4>
// //             {companyData.activity.map((act, i) => (
// //               <div key={i} className="text-sm py-1">{act}</div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CompanyProfileDashboard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { FaDownload, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
// // import { FiMenu } from "react-icons/fi";

// // const StatusBadge = ({ status }) => {
// //   const statusStyles = {
// //     "In Progress": "bg-blue-100 text-blue-600",
// //     "Won": "bg-green-100 text-green-600",
// //     "Submitted": "bg-gray-100 text-gray-700",
// //     "Rejected": "bg-red-100 text-red-600",
// //     "Urgent": "bg-red-100 text-red-600",
// //     "Scheduled": "bg-blue-100 text-blue-600",
// //     "On Track": "bg-green-100 text-green-600",
// //     "Pending": "bg-yellow-100 text-yellow-600",
// //   };
// //   return <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>{status}</span>;
// // };

// // const Sidebar = () => (
// //   <div className="w-full md:w-64 bg-white p-6 shadow-md h-full md:min-h-screen">
// //     <div className="mb-6">
// //       <h2 className="text-lg font-bold text-gray-800 mb-4">Navigation</h2>
// //       <ul className="space-y-2 text-sm">
// //         {[
// //           "Overview",
// //           "Team Details",
// //           "Proposals",
// //           "Documents",
// //           "Case Studies",
// //           "Certificates",
// //           "Settings",
// //         ].map((item, i) => (
// //           <li key={i} className={`hover:text-blue-600 ${item === "Overview" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>{item}</li>
// //         ))}
// //       </ul>
// //     </div>
// //     <div className="mt-8 text-sm">
// //       <p>myname@email.com</p>
// //       <p>+91-5877486484</p>
// //       <p>www.mywebsite.com</p>
// //     </div>
// //   </div>
// // );

// // const Navbar = () => (
// //   <div className="bg-white border-b shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
// //     <div className="flex items-center gap-4">
// //       <FiMenu className="text-xl" />
// //       <span className="font-bold text-lg">LOGO</span>
// //       <nav className="hidden md:flex gap-6 text-sm text-gray-700">
// //         {['Discover', 'Proposals', 'Dashboard', 'Profile'].map((item, i) => (
// //           <a key={i} href="#" className="hover:text-blue-600">{item}</a>
// //         ))}
// //       </nav>
// //     </div>
// //     <FaUserCircle className="text-2xl text-gray-600" />
// //   </div>
// // );

// // const CompanyProfileDashboard = () => {
// //   const [companyData1, setCompanyData1] = useState(null);

// //   useEffect(() => {
// //     axios.get("/api/company-dashboard")
// //       .then(res => setCompanyData1(res.data))
// //       .catch(err => console.error(err));
// //   }, []);

// //   const companyData = {
// //     companyName: "ABC Company Inc.",
// //     industry: "Technology Solutions & Consulting",
// //     location: "San Francisco, CA",
// //     email: "myname@email.com",
// //     phone: "+91-5877486484",
// //     website: "www.mywebsite.com",
// //     stats: {
// //       totalProposals: 156,
// //       wonProposals: 50,
// //       successRate: "55%",
// //       activeProposals: 12,
// //     },
// //     profile: {
// //       bio: "ABC Company Inc. is a leading technology consulting firm specializing in digital transformation, cloud solutions and enterprise software development. With over 15 years of experience, we help businesses leverage technology to achieve their strategic objectives.",
// //       services: [
// //         "Cloud Architecture",
// //         "Enterprise Solutions",
// //         "Data Analytics",
// //       ],
// //     },
// //     recentProposals: [
// //       { title: "Data Analytics Platform", date: "Jan 20, 2024", status: "In Progress" },
// //       { title: "Security Infrastructure", date: "Jan 20, 2024", status: "Won" },
// //       { title: "Enterprise Cloud Migration", date: "Jan 20, 2024", status: "Submitted" },
// //       { title: "We Development Site", date: "Jan 20, 2024", status: "Rejected" },
// //     ],
// //     documentLibrary: [
// //       { name: "Company Profile.pdf", type: "PDF", size: "2.5 MB" },
// //       { name: "Something.docx", type: "DOCX", size: "2.5 MB" },
// //     ],
// //     caseStudies: [
// //       "Future of Software Development",
// //       "All about AI & Technology",
// //       "A case study about everything",
// //     ],
// //     certifications: [
// //       { name: "ISO 5864", validTill: "Dec 2025" },
// //       { name: "ISO 5864", validTill: "Dec 2025" },
// //       { name: "ISO 5864", validTill: "Dec 2025" },
// //     ],
// //     deadlines: [
// //       { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
// //       { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
// //       { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
// //       { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
// //     ],
// //     activity: [
// //       "New proposal submitted",
// //       "Document updated",
// //       "Team meeting scheduled",
// //     ],
// //   };

// //   if (!companyData) return <p className="p-8">Loading...</p>;

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <Navbar />
// //       <div className="flex">
// //         <Sidebar />
// //         <div className="flex-1 p-6 md:p-10 text-gray-800">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
// //             <div>
// //               <h2 className="text-2xl font-semibold">{companyData.companyName}</h2>
// //               <p>{companyData.industry} | {companyData.location}</p>
// //               <p>{companyData.email} | {companyData.phone} | {companyData.website}</p>
// //             </div>
// //             <button className="text-blue-600 hover:underline mt-4 md:mt-0">Edit Profile</button>
// //           </div>

// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// //             {companyData?.stats && Object.entries(companyData.stats).map(([key, value]) => (
// //               <div key={key} className="bg-white p-4 rounded shadow text-center">
// //                 <div className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
// //                 <div className="text-xl font-bold text-blue-600">{value}</div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <div className="md:col-span-2">
// //               <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
// //               <p className="mb-4">{companyData.profile.bio}</p>
// //               <div className="flex flex-wrap gap-2">
// //                 {companyData.profile.services.map((service, i) => (
// //                   <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{service}</span>
// //                 ))}
// //               </div>

// //               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <h4 className="font-semibold mb-2">Recent Proposals</h4>
// //                   {companyData.recentProposals.map((proposal, i) => (
// //                     <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
// //                       <span>{proposal.title}</span>
// //                       <StatusBadge status={proposal.status} />
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <div>
// //                   <h4 className="font-semibold mb-2">Document Library</h4>
// //                   {companyData.documentLibrary.map((doc, i) => (
// //                     <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
// //                       <span>{doc.name} ({doc.type} | {doc.size})</span>
// //                       <button className="text-blue-500 text-xs flex items-center gap-1"><FaDownload className="text-sm" />Download</button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <h4 className="font-semibold mb-2">Case Studies</h4>
// //                   {companyData.caseStudies.map((study, i) => (
// //                     <div key={i} className="text-sm py-1 flex justify-between items-center bg-white p-2 rounded shadow">
// //                       <span>{study}</span>
// //                       <a href="#" className="text-blue-600 text-xs flex items-center gap-1">Read <FaExternalLinkAlt className="text-xs" /></a>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <div>
// //                   <h4 className="font-semibold mb-2">Certifications</h4>
// //                   {companyData.certifications.map((cert, i) => (
// //                     <div key={i} className="text-sm bg-white p-2 rounded shadow">
// //                       {cert.name} - Valid: {cert.validTill}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="md:col-span-1 space-y-6">
// //               <div>
// //                 <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
// //                 {companyData.deadlines.map((deadline, i) => (
// //                   <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
// //                     <span>{deadline.title}</span>
// //                     <StatusBadge status={deadline.status} />
// //                   </div>
// //                 ))}
// //               </div>
// //               <div>
// //                 <h4 className="font-semibold mb-2">Recent Activity</h4>
// //                 {companyData.activity.map((act, i) => (
// //                   <div key={i} className="bg-white p-2 rounded shadow text-sm">{act}</div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CompanyProfileDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaDownload, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";

// const StatusBadge = ({ status }) => {
//   const statusStyles = {
//     "In Progress": "bg-blue-100 text-blue-600",
//     "Won": "bg-green-100 text-green-600",
//     "Submitted": "bg-gray-100 text-gray-700",
//     "Rejected": "bg-red-100 text-red-600",
//     "Urgent": "bg-red-100 text-red-600",
//     "Scheduled": "bg-blue-100 text-blue-600",
//     "On Track": "bg-green-100 text-green-600",
//     "Pending": "bg-yellow-100 text-yellow-600",
//   };
//   return <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>{status}</span>;
// };

// const Sidebar = () => (
//   <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white p-6 shadow-md overflow-y-auto z-20">
//     <div className="mb-6">
//       <h2 className="text-lg font-bold text-gray-800 mb-4">Navigation</h2>
//       <ul className="space-y-2 text-sm">
//         {["Overview", "Team Details", "Proposals", "Documents", "Case Studies", "Certificates", "Settings"].map((item, i) => (
//           <li key={i} className={`hover:text-blue-600 ${item === "Overview" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>{item}</li>
//         ))}
//       </ul>
//     </div>
//     <div className="mt-8 text-sm">
//       <p>myname@email.com</p>
//       <p>+91-5877486484</p>
//       <p>www.mywebsite.com</p>
//     </div>
//   </div>
// );

// const RightSidebar = ({ deadlines, activity }) => (
//   <div className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white p-6 shadow-md overflow-y-auto z-20">
//     <div>
//       <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
//       {deadlines.map((deadline, i) => (
//         <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
//           <span>{deadline.title}</span>
//           <StatusBadge status={deadline.status} />
//         </div>
//       ))}
//     </div>
//     <div className="mt-6">
//       <h4 className="font-semibold mb-2">Recent Activity</h4>
//       {activity.map((act, i) => (
//         <div key={i} className="bg-white p-2 rounded shadow text-sm">{act}</div>
//       ))}
//     </div>
//   </div>
// );

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

// const CompanyProfileDashboard = () => {
//   const [companyData1, setCompanyData1] = useState(null);

//   useEffect(() => {
//     axios.get("/api/company-dashboard")
//       .then(res => setCompanyData1(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const companyData = {
//     companyName: "ABC Company Inc.",
//     industry: "Technology Solutions & Consulting",
//     location: "San Francisco, CA",
//     email: "myname@email.com",
//     phone: "+91-5877486484",
//     website: "www.mywebsite.com",
//     stats: {
//       totalProposals: 156,
//       wonProposals: 50,
//       successRate: "55%",
//       activeProposals: 12,
//     },
//     profile: {
//       bio: "ABC Company Inc. is a leading technology consulting firm...",
//       services: ["Cloud Architecture", "Enterprise Solutions", "Data Analytics"],
//     },
//     recentProposals: [
//       { title: "Data Analytics Platform", date: "Jan 20, 2024", status: "In Progress" },
//       { title: "Security Infrastructure", date: "Jan 20, 2024", status: "Won" },
//       { title: "Enterprise Cloud Migration", date: "Jan 20, 2024", status: "Submitted" },
//       { title: "We Development Site", date: "Jan 20, 2024", status: "Rejected" },
//     ],
//     documentLibrary: [
//       { name: "Company Profile.pdf", type: "PDF", size: "2.5 MB" },
//       { name: "Something.docx", type: "DOCX", size: "2.5 MB" },
//     ],
//     caseStudies: [
//       "Future of Software Development",
//       "All about AI & Technology",
//       "A case study about everything",
//     ],
//     certifications: [
//       { name: "ISO 5864", validTill: "Dec 2025" },
//       { name: "ISO 5864", validTill: "Dec 2025" },
//       { name: "ISO 5864", validTill: "Dec 2025" },
//     ],
//     deadlines: [
//       { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
//       { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
//       { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
//       { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
//     ],
//     activity: [
//       "New proposal submitted",
//       "Document updated",
//       "Team meeting scheduled",
//     ],
//   };

//   if (!companyData) return <p className="p-8">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <Sidebar />
//       <RightSidebar deadlines={companyData.deadlines} activity={companyData.activity} />
//       <main className="ml-64 mr-64 pt-20 px-6 pb-10 overflow-y-auto">
//         <div className="text-gray-800">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-semibold">{companyData.companyName}</h2>
//               <p>{companyData.industry} | {companyData.location}</p>
//               <p>{companyData.email} | {companyData.phone} | {companyData.website}</p>
//             </div>
//             <button className="text-blue-600 hover:underline mt-4 md:mt-0">Edit Profile</button>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {Object.entries(companyData.stats).map(([key, value]) => (
//               <div key={key} className="bg-white p-4 rounded shadow text-center">
//                 <div className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
//                 <div className="text-xl font-bold text-blue-600">{value}</div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 gap-6">
//             <div>
//               <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
//               <p className="mb-4">{companyData.profile.bio}</p>
//               <div className="flex flex-wrap gap-2">
//                 {companyData.profile.services.map((service, i) => (
//                   <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{service}</span>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-semibold mb-2">Recent Proposals</h4>
//                 {companyData.recentProposals.map((proposal, i) => (
//                   <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
//                     <span>{proposal.title}</span>
//                     <StatusBadge status={proposal.status} />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-2">Document Library</h4>
//                 {companyData.documentLibrary.map((doc, i) => (
//                   <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm">
//                     <span>{doc.name} ({doc.type} | {doc.size})</span>
//                     <button className="text-blue-500 text-xs flex items-center gap-1"><FaDownload className="text-sm" />Download</button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-semibold mb-2">Case Studies</h4>
//                 {companyData.caseStudies.map((study, i) => (
//                   <div key={i} className="text-sm py-1 flex justify-between items-center bg-white p-2 rounded shadow">
//                     <span>{study}</span>
//                     <a href="#" className="text-blue-600 text-xs flex items-center gap-1">Read <FaExternalLinkAlt className="text-xs" /></a>
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-2">Certifications</h4>
//                 {companyData.certifications.map((cert, i) => (
//                   <div key={i} className="text-sm bg-white p-2 rounded shadow">
//                     {cert.name} - Valid: {cert.validTill}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CompanyProfileDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

// Reusable Badge
const StatusBadge = ({ status }) => {
  const statusStyles = {
    "In Progress": "bg-blue-100 text-blue-600",
    "Won": "bg-green-100 text-green-600",
    "Submitted": "bg-gray-100 text-gray-700",
    "Rejected": "bg-red-100 text-red-600",
    "Urgent": "bg-red-100 text-red-600",
    "Scheduled": "bg-blue-100 text-blue-600",
    "On Track": "bg-green-100 text-green-600",
    "Pending": "bg-yellow-100 text-yellow-600",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || "bg-gray-200 text-gray-700"}`}>
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
          <a key={i} href="#" className="hover:text-blue-600">
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
  <div className={`fixed top-16 left-0 ${isMobile ? "w-full h-full" : "w-64 h-[calc(100vh-4rem)]"} bg-white p-6 shadow-md overflow-y-auto z-40`}>
    {isMobile && (
      <button onClick={onClose} className="block text-right w-full text-gray-600 mb-4">Close</button>
    )}
    <h2 className="text-lg font-bold text-gray-800 mb-4">Navigation</h2>
    <ul className="space-y-2 text-sm">
      {["Overview", "Team Details", "Proposals", "Documents", "Case Studies", "Certificates", "Settings"].map((item, i) => (
        <li key={i} className={`hover:text-blue-600 ${item === "Overview" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>{item}</li>
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
// const RightSidebar = ({ deadlines, activity }) => (
//   <div className="hidden lg:block fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white p-6 shadow-md overflow-y-auto z-20">
//     <div>
//       <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
//       {deadlines.map((deadline, i) => (
//         <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm mb-2">
//           <span>{deadline.title}</span>
//           <StatusBadge status={deadline.status} />
//         </div>
//       ))}
//     </div>
//     <div className="mt-6">
//       <h4 className="font-semibold mb-2">Recent Activity</h4>
//       {activity.map((act, i) => (
//         <div key={i} className="bg-white p-2 rounded shadow text-sm mb-2">{act}</div>
//       ))}
//     </div>
//   </div>
// );
const RightSidebar = ({ deadlines, activity, isMobile, onClose }) => {
  const content = (
    <>
      <div>
        <h4 className="font-semibold mb-2">Upcoming Deadlines</h4>
        {deadlines.map((deadline, i) => (
          <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm mb-2">
            <span>{deadline.title}</span>
            <StatusBadge status={deadline.status} />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Recent Activity</h4>
        {activity.map((act, i) => (
          <div key={i} className="bg-white p-2 rounded shadow text-sm mb-2">{act}</div>
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
    <div className="hidden lg:block fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white p-6 shadow-md overflow-y-auto z-20">
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
      bio: "ABC Company Inc. is a leading technology consulting firm...",
      services: ["Cloud Architecture", "Enterprise Solutions", "Data Analytics"],
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
      "New proposal submitted",
      "Document updated",
      "Team meeting scheduled",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar onToggle={() => setIsMobileNavOpen(true)} />
      <div className="hidden md:block"><Sidebar /></div>
      {isMobileNavOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-40 z-30" onClick={() => setIsMobileNavOpen(false)}></div>
          <Sidebar isMobile onClose={() => setIsMobileNavOpen(false)} />
        </>
      )}
      {/* <RightSidebar deadlines={companyData.deadlines} activity={companyData.activity} /> */}
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
        className="block lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white px-4 py-2 rounded-full shadow"
        onClick={() => setShowRightSidebar(true)}
      >
        Activity
      </button>

      <main className="pt-20 px-4 sm:px-6 pb-10 overflow-y-auto md:ml-64 lg:mr-64">
        <div className="text-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{companyData.companyName}</h2>
              <p>{companyData.industry} | {companyData.location}</p>
              <p>{companyData.email} | {companyData.phone} | {companyData.website}</p>
            </div>
            <button className="text-blue-600 hover:underline mt-4 md:mt-0">Edit Profile</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Object.entries(companyData.stats).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded shadow text-center">
                <div className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                <div className="text-xl font-bold text-blue-600">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
              <p className="mb-4">{companyData.profile.bio}</p>
              <div className="flex flex-wrap gap-2">
                {companyData.profile.services.map((service, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{service}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Recent Proposals</h4>
                {companyData.recentProposals.map((proposal, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm mb-2">
                    <span>{proposal.title}</span>
                    <StatusBadge status={proposal.status} />
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Document Library</h4>
                {companyData.documentLibrary.map((doc, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow text-sm mb-2">
                    <span>{doc.name} ({doc.type} | {doc.size})</span>
                    <button className="text-blue-500 text-xs flex items-center gap-1"><FaDownload className="text-sm" />Download</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Case Studies</h4>
                {companyData.caseStudies.map((study, i) => (
                  <div key={i} className="text-sm py-1 flex justify-between items-center bg-white p-2 rounded shadow mb-2">
                    <span>{study}</span>
                    <a href="#" className="text-blue-600 text-xs flex items-center gap-1">Read <FaExternalLinkAlt className="text-xs" /></a>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Certifications</h4>
                {companyData.certifications.map((cert, i) => (
                  <div key={i} className="text-sm bg-white p-2 rounded shadow mb-2">
                    {cert.name} - Valid: {cert.validTill}
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
