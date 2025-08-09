import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineEdit, MdOutlineSearch, MdOutlineAddAPhoto, MdOutlineBusinessCenter, MdOutlineHome, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineGroups, MdOutlineDocumentScanner, MdOutlineFolder, MdOutlineAssignment, MdOutlineVerifiedUser, MdOutlineSettings, MdOutlineDownload, MdOutlineOpenInNew, MdOutlineGroup, MdOutlineCalendarToday, MdOutlineAdd, MdOutlineClose, MdOutlinePhone, MdOutlineEmail, MdOutlineCheck } from "react-icons/md";
import NavbarComponent from "./NavbarComponent";
import { useProfile } from "../context/ProfileContext";

// Short desc, job title, highest edu, skills

// Unified Badge Styles
const badgeStyles = {
  // Status badges
  "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
  "Won": "bg-[#DCFCE7] text-[#15803D]",
  "Submitted": "bg-[#DCFCE7] text-[#15803D]",
  "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
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
    <span className={`px-2 py-1 text-[12px] rounded-full text-center ${badgeStyles[status] || "bg-[#E5E7EB] text-gray-700"}`}>
      {status}
    </span>
  );
};


const sidebarItems = [
  { name: "Overview", icon: <MdOutlineHome className="w-6 h-6" /> },
  { name: "Team Details", icon: <MdOutlineGroups className="w-6 h-6" /> },
  { name: "Proposals", icon: <MdOutlineDocumentScanner className="w-6 h-6" /> },
  { name: "Documents", icon: <MdOutlineFolder className="w-6 h-6" /> },
  { name: "Case Studies", icon: <MdOutlineAssignment className="w-6 h-6" /> },
  { name: "Certificates", icon: <MdOutlineVerifiedUser className="w-6 h-6" /> },
  { name: "Settings", icon: <MdOutlineSettings className="w-6 h-6" /> },
];

// Mobile Dropdown Component
const MobileDropdown = ({ activeTab, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="max-w-[250px] flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#2563EB]">{sidebarItems.find(item => item.name === activeTab)?.icon}</span>
          <span className="font-medium text-[#2563EB]">{activeTab}</span>
        </div>
        <svg
          className={`ml-1 w-5 h-5 text-[#2563EB] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg w-full xs:w-1/2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onSelect(item.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${item.name === activeTab ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-gray-700'
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const Sidebar = ({ isMobile = false, onClose = () => { }, active = "Overview", onSelect }) => (
  <div
    className={`fixed ${isMobile ? "top-0 w-64 h-full z-50" : "mt-9 w-64 h-full z-50"
      } left-0 bg-white shadow-md overflow-hidden flex flex-col`}
  >
    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <ul className="space-y-[1px] min-h-[100vh]">
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
  </div>
);

const RightSidebar = ({ deadlines, activity, isMobile, onClose }) => {
  const content = (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-6">
      <div className="min-h-[80vh] lg:min-h-[125vh]">
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
        <div className="mt-8">
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
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
        <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-lg flex flex-col">
          <div className="text-right mb-4 p-6 pb-0 flex-shrink-0">
            <button onClick={onClose} className="text-gray-600 font-semibold">Close</button>
          </div>
          <div className="flex-1 overflow-hidden px-6 pb-6">
            {content}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:block fixed mt-9 right-0 w-64 h-full bg-[#F8F9FA] shadow-md z-20 flex flex-col">
      {content}
    </div>
  );
};

// Team Member Profile Modal
const TeamMemberModal = ({ member, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 max-w-[90vw] z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Team Member Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center text-2xl font-bold text-gray-500">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-gray-600">{member.jobTitle}</p>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${badgeStyles[member.accessLevel]}`}>
                {member.accessLevel}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MdOutlineEmail className="w-4 h-4" />
              <span>{member.email || "Email not available."}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdOutlinePhone className="w-4 h-4" />
              <span>{member.phone || "Phone not available."}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h5 className="font-medium mb-2">Short Description</h5>
            <p className="text-gray-600 text-sm">
              {member.shortDesc || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Contact Options Modal
const ContactModal = ({ member, isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactOptions = [
    { icon: <MdOutlineEmail className="w-5 h-5" />, label: "Send Email", action: () => window.open(`mailto:${member.email}`) },
    { icon: <MdOutlinePhone className="w-5 h-5" />, label: "Call", action: () => window.open(`tel:${member.phone}`) },
    // { icon: <MdOutlineLinkedCamera className="w-5 h-5" />, label: "LinkedIn", action: () => window.open(`${member.linkedIn}`) },
    // { icon: <MdOutlineOpenInNew className="w-5 h-5" />, label: "Schedule Meeting", action: () => window.open('https://calendly.com') },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-80 max-w-[90vw] z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Contact {member.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {contactOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.action();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// Add Team Member Modal
const AddTeamMemberModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    email: '',
    shortDesc: '',
    highestQualification: '',
    skills: '',
    phone: '',
    accessLevel: 'Member'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let skillsArray = formData.skills.split(',').map(skill => skill.trim());
      formData.skills = skillsArray;
      const response = await axios.post('https://proposal-form-backend.vercel.app/api/profile/addEmployee', formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      //console.log('Response:', response.data.message);
      alert(response.data.message);
      onClose();
    } catch (error) {
      //console.error('Error adding team member:', error);
      alert('Failed to add team member. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 h-full max-w-[90vw] z-50 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Team Member</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
            <input
              type="text"
              value={formData.highestQualification}
              onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="e.g., React, Node.js, Project Management"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
              <option value="Member">Member</option>
            </select>
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
              onClick={() => handleSubmit(formData)}
              className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Add Case Study Modal
const AddCaseStudyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    file: null,
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF or TXT
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')) {
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
      alert('Please upload a PDF or TXT file.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('file', formData.file);

      const response = await axios.post('https://proposal-form-backend.vercel.app/api/profile/addCaseStudy', formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      //console.log('Response:', response.data.message);
      alert(response.data.message);
      onClose();
    } catch (error) {
      //console.error('Error adding case study:', error);
      alert('Failed to add case study. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 max-w-[90vw] z-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Case Study</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Enter case study title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Enter case study company"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF or TXT)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2563EB] transition-colors">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-[#2563EB] hover:text-[#1d4ed8]">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">PDF or TXT files only</div>
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
                      document.getElementById('file-upload').value = '';
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
              className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]"
            >
              Add Case Study
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Add Certificate Modal
const AddCertificateModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    validTill: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://proposal-form-backend.vercel.app/api/profile/addLicenseAndCertification', formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      //console.log('Response:', response.data.message);
      alert(response.data.message);
      onClose();
    } catch (error) {
      //console.error('Error adding certificate:', error);
      alert('Failed to add certificate. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 max-w-[90vw] z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Certificate</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input
              type="date"
              value={formData.validTill}
              onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              rows="3"
            />
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
              className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]"
            >
              Add Certificate
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Add Document Modal
const AddDocumentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    file: null,
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF or TXT
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')) {
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.file.type === 'application/pdf' ? 'PDF' : 'TXT');
      formDataToSend.append('document', formData.file);

      const response = await axios.post('https://proposal-form-backend.vercel.app/api/profile/addDocument', formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      //console.log('Response:', response.data.message);
      alert(response.data.message);
      onClose();
    } catch (error) {
      //console.error('Error adding document:', error);
      alert('Failed to add document. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-96 max-w-[90vw] z-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Document</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>💡 <strong>Tip:</strong> Upload relevant company documents that showcase your expertise and capabilities. These documents will be used to enhance proposal recommendations and improve your proposal creation process.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Enter document name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2563EB] transition-colors">
              <input
                type="file"
                accept=".pdf,.txt"
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
                  <div className="text-xs text-gray-500">PDF or TXT files only</div>
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
              className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Main Component
const CompanyProfileDashboard = () => {
  const navigate = useNavigate();
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  // Remove local companyData, loading, error
  // const [companyData, setCompanyData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Use context
  const { companyData, loading, error, refreshProfile } = useProfile();

  // Logo upload state and ref
  const [logoUrl, setLogoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Modal states
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddCaseStudyModal, setShowAddCaseStudyModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [filteredProposals, setFilteredProposals] = useState([]);

  // Remove useEffect for fetching company data
  // useEffect(() => { ... }, []);

  // Set logoUrl from companyData
  React.useEffect(() => {
    if (companyData && companyData.logoUrl_1) {
      setLogoUrl(companyData.logoUrl_1);
    } else if (companyData && companyData.logoUrl) {
      setLogoUrl(companyData.logoUrl);
    }
  }, [companyData]);

  React.useEffect(() => {
    setFilteredProposals(companyData?.proposalList || []);
  }, [companyData]);

  // Updated Button handlers
  const handleEditProfile = () => {
    navigate('/company-profile-update', {
      state: {
        companyData: companyData
      }
    });
  };

  const handleDownloadDocument = async (docItem) => {
    try {
      // Determine content type based on file extension
      const fileExtension = docItem.type.toLowerCase();
      let contentType;

      switch (fileExtension) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'txt':
          contentType = 'text/plain';
          break;
        default:
          contentType = 'application/octet-stream';
      }

      // Download the actual document from the backend as binary
      const response = await axios.get(
        `https://proposal-form-backend.vercel.app/api/profile/getDocument/${docItem.fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          responseType: 'arraybuffer' // <-- THIS IS IMPORTANT
        }
      );

      // Create a Blob from the binary data
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = docItem.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      //console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleReadCaseStudy = (caseStudy) => {
    // For case studies with file URLs, open them
    if (caseStudy.fileUrl) {
      window.open(caseStudy.fileUrl, '_blank');
    } else {
      // For case studies without file URLs, show an alert
      alert(`Opening case study: ${caseStudy.title}`);
    }
  };

  const handleAddTeamMember = () => {
    setShowAddMemberModal(true);
  };

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleContactMember = (member) => {
    setSelectedMember(member);
    setShowContactModal(true);
  };

  const handleSearchProposals = (searchTerm) => {
    const filtered = companyData?.proposalList.filter(proposal =>
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProposals(filtered);
  };

  const handleAddCaseStudy = () => {
    setShowAddCaseStudyModal(true);
  };

  const handleAddCertification = () => {
    setShowAddCertificateModal(true);
  };

  const handleAddDocument = () => {
    setShowAddDocumentModal(true);
  };

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
            onClick={refreshProfile}
            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setEditMode(true); // Ensure editMode stays true after file selection
  };

  const handleSaveLogo = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const response = await axios.post(
        'https://proposal-form-backend.vercel.app/api/profile/uploadLogo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLogoUrl("https://proposal-form-backend.vercel.app/api/profile/getProfileImage/file/" + response.data.logoUrl);
      // //console.log(logoUrl);
      setEditMode(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      alert('Logo updated!');
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  // Image/logo hover and edit handlers
  const handleLogoMouseEnter = () => setIsHoveringLogo(true);

  const handleLogoMouseLeave = () => {
    setIsHoveringLogo(false);
    // Only reset editMode if not editing (no preview/file selected)
    if (!previewUrl) {
      setEditMode(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleEditLogo = (e) => {
    e.stopPropagation();
    setEditMode(true);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCancelLogo = () => {
    setEditMode(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="h-full relative">
      <NavbarComponent />

      <div className="bg-[#F8F9FA] w-full mt-16 md:mt-0 md:fixed md:top-16 left-0 right-0 z-10 shadow-md px-8 md:px-12 py-[14px]">
        {/* Profile image and info */}
        <div className="w-full">
          {/* For <lg: Row 1 - image and edit button */}
          <div className="flex flex-row items-center justify-between gap-4 lg:hidden mb-2">
            {/* Profile Image */}
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 bg-[#E0E0E0] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative group"
                onMouseEnter={handleLogoMouseEnter}
                onMouseLeave={handleLogoMouseLeave}
                title="Upload company logo"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <MdOutlineAddAPhoto className="w-6 h-6 text-[#6B7280]" />
                )}
                {(isHoveringLogo || editMode) && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-2 transition-opacity">
                    {!editMode ? (
                      <button
                        className="bg-white p-2 rounded-full hover:bg-[#EFF6FF] flex items-center justify-center"
                        onClick={handleEditLogo}
                        title="Edit"
                      >
                        <MdOutlineEdit className="w-6 h-6 text-[#2563EB]" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="bg-[#2563EB] p-2 rounded-full flex items-center justify-center hover:bg-[#1d4ed8]"
                          onClick={handleSaveLogo}
                          title="Save"
                        >
                          <MdOutlineCheck className="w-6 h-6 text-white" />
                        </button>
                        <button
                          className="bg-white p-2 rounded-full flex items-center justify-center hover:bg-[#EFF6FF]"
                          onClick={handleCancelLogo}
                          title="Cancel"
                        >
                          <MdOutlineClose className="w-6 h-6 text-[#2563EB]" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Edit Button */}
            <button
              className="text-[#2563EB] text-[15px] sm:text-[16px] flex items-center gap-1 hover:bg-[#EFF6FF] px-2 sm:px-3 py-2 rounded-lg transition-colors"
              onClick={() => handleEditProfile()}
            >
              <MdOutlineEdit className="w-5 h-5 shrink-0" /> Edit Profile
            </button>
          </div>
          {/* For <lg: Row 2 - company info */}
          <div className="block lg:hidden">
            {/* Company Info */}
            <h2 className="text-[20px] sm:text-[22px] font-semibold mb-2 break-words">{companyData?.companyName || 'Loading...'}</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MdOutlineBusinessCenter className="w-5 h-5 shrink-0 text-[#4B5563]" />
                <p className="text-[13px] sm:text-[14px] text-[#4B5563]">{companyData?.industry || 'Loading...'}</p>
              </div>
              <div className="ml-1 w-[2px] h-6 bg-[#111827] hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <MdOutlineLocationOn className="w-5 h-5 shrink-0 text-[#4B5563]" />
                <p className="text-[13px] sm:text-[14px] text-[#4B5563]">{companyData?.location || 'Loading...'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <MdOutlineMail className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[13px] sm:text-[14px] text-[#6B7280]">{companyData?.email || 'Loading...'}</p>
              </div>
              <div className="ml-1 w-[2px] h-6 bg-[#111827] hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <MdOutlineCall className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[13px] sm:text-[14px] text-[#6B7280]">{companyData?.phone || 'Loading...'}</p>
              </div>
              <div className="ml-1 w-[2px] h-6 bg-[#111827] hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <MdOutlineLanguage className="w-5 h-5 shrink-0 text-[#6B7280]" />
                <p className="text-[13px] sm:text-[14px] text-[#6B7280]">{companyData?.website || 'Loading...'}</p>
              </div>
            </div>
          </div>
          {/* For lg and up: all in a row */}
          <div className="hidden lg:flex flex-row items-start gap-4 flex-wrap w-full">
            {/* Profile Image */}
            <div className="flex flex-col items-center justify-center mb-0">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <div
                className="w-[120px] h-[120px] bg-[#E0E0E0] rounded-lg flex items-center justify-center mb-2 cursor-pointer overflow-hidden relative group"
                onMouseEnter={handleLogoMouseEnter}
                onMouseLeave={handleLogoMouseLeave}
                title="Upload company logo"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <MdOutlineAddAPhoto className="w-6 h-6 text-[#6B7280]" />
                )}
                {(isHoveringLogo || editMode) && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-2 transition-opacity">
                    {!editMode ? (
                      <button
                        className="bg-white p-2 rounded-full hover:bg-[#EFF6FF] flex items-center justify-center"
                        onClick={handleEditLogo}
                        title="Edit"
                      >
                        <MdOutlineEdit className="w-6 h-6 text-[#2563EB]" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="bg-[#2563EB] p-2 rounded-full flex items-center justify-center hover:bg-[#1d4ed8]"
                          onClick={handleSaveLogo}
                          title="Save"
                        >
                          <MdOutlineCheck className="w-6 h-6 text-white" />
                        </button>
                        <button
                          className="bg-white p-2 rounded-full flex items-center justify-center hover:bg-[#EFF6FF]"
                          onClick={handleCancelLogo}
                          title="Cancel"
                        >
                          <MdOutlineClose className="w-6 h-6 text-[#2563EB]" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Company Info */}
            <div className="flex-1 md:mr-12 w-full min-w-[200px]">
              <h2 className="text-[24px] font-semibold mb-2 break-words">{companyData?.companyName || 'Loading...'}</h2>
              <div className="flex flex-row items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <MdOutlineBusinessCenter className="w-5 h-5 shrink-0 text-[#4B5563]" />
                  <p className="text-[16px] text-[#4B5563]">{companyData?.industry || 'Loading...'}</p>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <MdOutlineLocationOn className="w-5 h-5 shrink-0 text-[#4B5563]" />
                  <p className="text-[16px] text-[#4B5563]">{companyData?.location || 'Loading...'}</p>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex items-center gap-2">
                  <MdOutlineMail className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[16px] text-[#6B7280]">{companyData?.email || 'Loading...'}</p>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <MdOutlineCall className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[16px] text-[#6B7280]">{companyData?.phone || 'Loading...'}</p>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <MdOutlineLanguage className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  <p className="text-[16px] text-[#6B7280]">{companyData?.website || 'Loading...'}</p>
                </div>
              </div>
            </div>
            {/* Edit Button */}
            <div className="flex items-start mt-0">
              <button
                className="text-[#2563EB] text-[16px] flex items-center gap-1 hover:bg-[#EFF6FF] px-3 py-2 rounded-lg transition-colors"
                onClick={() => handleEditProfile()}
              >
                <MdOutlineEdit className="w-5 h-5 shrink-0" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
          {companyData?.stats && Object.entries(companyData.stats).map(([key, value]) => (
            <div key={key} className="p-3 sm:p-4 rounded shadow text-left bg-[#FFFFFF]">
              <div className="text-[11px] sm:text-[13px] md:text-[16px] text-[#6B7280] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="text-[15px] sm:text-[18px] md:text-[24px] font-semibold text-[#2563EB]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden md:block md:mt-[25.5rem] lg:mt-[20rem]">
        <div className="relative z-10">
          <Sidebar active={activeTab} onSelect={setActiveTab} />
        </div>
        {showRightSidebar && (
          <div className="absolute inset-0 bg-black bg-opacity-40 z-50 pointer-events-auto"></div>
        )}
      </div>

      <div className="hidden lg:block mt-[20rem]"><RightSidebar deadlines={companyData?.deadlines || []} activity={companyData?.activity || []} /></div>
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

      <main className="flex-1 md:-mt-7 py-16 px-4 sm:px-8 pb-10 overflow-y-auto md:ml-64 lg:mr-64">
        <div className="bg-[#FFFFFF] ml-3">
          {/* Mobile Dropdown */}
          <div className="relative md:hidden right-0 -mt-12 mb-4"><MobileDropdown activeTab={activeTab} onSelect={setActiveTab} /></div>
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-[24px] font-semibold mb-2">Company Profile</h3>
                <p className="text-[#4B5563] text-[16px] mb-4">{companyData?.profile?.bio || 'Loading...'}</p>
                <h3 className="font-medium text-[#111827] text-[16px] mb-2">Services</h3>
                <ul className="columns-1 xs:columns-2 lg:columns-3 gap-4 list-disc gap-2 mt-2 ml-8">
                  {companyData?.profile?.services && companyData.profile.services.length > 0 ? (
                    companyData.profile.services.map((service, i) => (
                      <li
                        key={i}
                        className="text-[15px] text-[#6B7280] mb-2 break-inside-avoid"
                      >
                        {service}
                      </li>
                    ))
                  ) : (
                    <li className="col-span-full text-[#9CA3AF] py-2 text-[16px] list-none">No services listed yet...</li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Recent Proposals</h4>
                  {companyData?.proposalList && companyData.proposalList.length > 0 ? (
                    companyData.proposalList.slice(0, 4).map((proposal, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-4 gap-2">
                        <div className="flex flex-col truncate">
                          <span className="text-[14px] text-[#111827]">{proposal.title}</span>
                          <span className="text-[11px] text-[#9CA3AF]">{proposal.date}</span>
                        </div>
                        <StatusBadge status={proposal.status} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#9CA3AF] py-8 text-[16px]">No proposals yet...</div>
                  )}
                </div>
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Document Library</h4>
                  {companyData?.documentList && companyData.documentList.length > 0 ? (
                    companyData.documentList.slice(0, 4).map((doc, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-2">
                        <div className="flex items-center gap-4 flex-1 justify-between w-full">
                          <MdOutlineDocumentScanner className="text-[#2563EB] w-6 h-6 shrink-0" />
                          <div className="flex flex-col truncate">
                            <span className="text-[14px] text-[#111827]">{doc.name}</span>
                            <span className="text-[12px] text-[#4B5563]">({doc.type} | {(doc.size / 1024 > 1024) ? ((doc.size / 1024 / 1024).toFixed(2) + " MB") : ((doc.size / 1024).toFixed(2) + " KB")})</span>
                          </div>
                          <button
                            className="text-[#2563EB] text-xs flex items-center gap-1 hover:bg-[#EFF6FF] rounded-full p-1 transition-colors shrink-0"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <MdOutlineDownload className="text-[#2563EB] w-6 h-6 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#9CA3AF] py-8 text-[16px]">No documents yet...</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Case Studies</h4>
                  {companyData?.caseStudiesList && companyData.caseStudiesList.length > 0 ? (
                    companyData.caseStudiesList.slice(0, 4).map((study, i) => (
                      <div key={i} className="bg-[#F9FAFB] py-1 flex justify-between items-center p-2 rounded shadow mb-2">
                        <div className="flex flex-col items-start truncate flex-1">
                          <span className="text-[14px] text-[#111827] truncate w-full" title={study.title}>{study.title}</span>
                          <span className="text-[12px] text-[#4B5563]">{study.readTime}</span>
                        </div>
                        <button
                          className="text-[#2563EB] text-xs flex items-center gap-1 hover:bg-[#EFF6FF] rounded-full p-1 transition-colors ml-2"
                          onClick={() => handleReadCaseStudy(study)}
                        >
                          <MdOutlineOpenInNew className="text-[#2563EB] w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#9CA3AF] py-8 text-[16px]">No case studies yet...</div>
                  )}
                </div>
                <div className="border border-1 border-[#E5E7EB] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#000000] text-[16px] mb-2">Certifications</h4>
                  {companyData?.certificationsList && companyData.certificationsList.length > 0 ? (
                    companyData.certificationsList.slice(0, 4).map((cert, i) => (
                      <div key={i} className="flex items-center p-2 mb-2 bg-[#F9FAFB]">
                        <MdOutlineAssignment className="text-[#2563EB] w-6 h-6" />
                        <div className="flex flex-col items-start ml-2 truncate">
                          <span className="text-[14px] text-[#111827]">{cert.name}</span >
                          <span className="text-[11px] text-[#4B5563]">Valid Till: {cert.validTill}</span >
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#9CA3AF] py-8 text-[16px]">No certifications yet...</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Team Details" && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-[24px] font-semibold mb-2">About Company</h3>
                <p className="text-[#4B5563] text-[16px] mb-4">{companyData?.profile?.bio || 'Loading...'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2 sm:mb-4 md:mb-8">
                  {companyData?.companyDetails && Object.entries(companyData.companyDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 rounded shadow bg-[#F9FAFB] mb-2">
                      <div className="flex flex-col items-start">
                        <div className="flex flex-row items-center gap-2 mb-1">
                          <span>{key === "No.of employees" ? <MdOutlineGroup className="w-6 h-6 text-[#2563EB] shrink-0" /> : key === "Founded" ? <MdOutlineCalendarToday className="w-6 h-6 text-[#2563EB] shrink-0" /> : <MdOutlineBusinessCenter className="w-6 h-6 text-[#2563EB] shrink-0" />}</span>
                          <span className="text-[12px] md:text-[16px] text-[#6B7280]">{key}</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyData?.employees && companyData.employees.length > 0 ? (
                      companyData.employees.map((member, i) => (
                        <div key={i} className="rounded-xl shadow bg-[#F9FAFB] p-4 flex flex-col gap-2 items-start">
                          <span className={`px-2 py-1 text-[12px] rounded-full font-medium ${badgeStyles[member.accessLevel]}`}>{member.accessLevel}</span>
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover min-w-[40px] min-h-[40px]" />
                              ) : (
                                member.name.split(' ').map(n => n[0]).join('')
                              )}
                            </div>
                            <div className="flex flex-col flex-1 truncate overflow-ellipsis">
                              <span className="font-medium text-[16px] text-[#111827]">{member.name}</span>
                              <span className="text-[14px] text-[#4B5563]">{member.jobTitle}</span>
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
                      ))
                    ) : (
                      <div className="col-span-full text-center text-[#9CA3AF] py-8 text-[16px]">Nothing yet... Add your first team member!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Proposals" && (
            <div className="bg-white rounded-xl p-2">
              <h2 className="text-[24px] font-semibold mb-2">Proposals</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-1 gap-4 sm:justify-end items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search proposals by title or client"
                      className="w-full md:w-1/2 border border-[#E5E7EB] rounded-lg px-4 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] pl-10"
                      onChange={(e) => handleSearchProposals(e.target.value)}
                    />
                    <MdOutlineSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 lg:gap-6">
                {filteredProposals && filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal, i) => (
                    <div key={i} className="relative bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
                      <span className={`absolute top-4 right-4 px-2 py-1 text-xs rounded-full font-medium ${badgeStyles[proposal.status]}`}>{proposal.status}</span>
                      <div className="font-semibold text-[16px] text-[#111827] mb-1 truncate">{proposal.title}</div>
                      <div className="text-[14px] text-[#6B7280] mb-1 truncate">{proposal.client}</div>
                      <div className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-1">
                        <MdOutlineCalendarToday className="w-4 h-4 text-[#9CA3AF]" />
                        <span>{proposal.deadline.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-[#9CA3AF] py-8 text-[16px]">No proposals yet... Start by creating a new proposal!</div>
                )}
              </div>
            </div>
          )}
          {activeTab === "Documents" && (
            <div className="bg-white rounded-xl p-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[24px] font-semibold">Company Documents</h2>
                <button
                  className="flex items-center gap-1 text-[#2563EB] font-medium border border-[#2563EB] px-3 py-1 rounded-lg text-[15px] hover:bg-[#EFF6FF] transition-colors"
                  onClick={handleAddDocument}
                >
                  <MdOutlineAdd className="w-5 h-5" /> Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg: gap-4 gap-y-8">
                {companyData?.documentList && companyData.documentList.length > 0 ? (
                  companyData.documentList.map((doc, i) => (
                    <div key={i} className="flex flex-col bg-[#F9FAFB] rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-[#111827] text-[14px] truncate max-w-[140px] min-w-0" title={doc.name}>{doc.name}</span>
                            <span className="text-[11px] text-[#4B5563]">{doc.type}, {(doc.size / 1024 > 1024) ? ((doc.size / 1024 / 1024).toFixed(2) + " MB") : ((doc.size / 1024).toFixed(2) + " KB")}</span>
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
                  ))
                ) : (
                  <div className="col-span-full text-center text-[#9CA3AF] py-8 text-[16px]">No documents yet... Upload your first document!</div>
                )}
              </div>
            </div>
          )}
          {activeTab === "Case Studies" && (
            <div className="bg-white rounded-xl p-2">
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
                {companyData?.caseStudiesList && companyData.caseStudiesList.length > 0 ? (
                  companyData.caseStudiesList.map((cs, i) => (
                    <div key={i} className="bg-[#F9FAFB] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
                      <div className="flex-1 flex flex-col p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" />
                          <div className="font-medium text-[#111827] justify-center text-[15px] mb-1 line-clamp-2" title={cs.title}>{cs.title}</div>
                        </div>
                        <div className="text-[13px] text-[#6B7280] mb-1 line-clamp-3" title={cs.description}>{cs.description}</div>
                        <div className="text-[12px] text-[#9CA3AF] mb-2">{cs.readTime}</div>
                        <button
                          onClick={() => handleReadCaseStudy(cs)}
                          className="text-[#2563EB] text-[14px] flex items-center gap-1 mt-auto hover:underline transition-colors"
                        >
                          Read Case Study <MdOutlineOpenInNew className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-[#9CA3AF] py-8 text-[16px]">No case studies yet... Add your first case study!</div>
                )}
              </div>
            </div>
          )}
          {activeTab === "Certificates" && (
            <div className="bg-white rounded-xl p-2">
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
                {companyData?.certificationsList && companyData.certificationsList.length > 0 ? (
                  companyData.certificationsList.map((cert, i) => (
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
                  ))
                ) : (
                  <div className="col-span-full text-center text-[#9CA3AF] py-8 text-[16px]">No certifications yet... Add your first certification!</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
      />

      <ContactModal
        member={selectedMember}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <AddTeamMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
      />

      <AddCaseStudyModal
        isOpen={showAddCaseStudyModal}
        onClose={() => setShowAddCaseStudyModal(false)}
      />

      <AddCertificateModal
        isOpen={showAddCertificateModal}
        onClose={() => setShowAddCertificateModal(false)}
      />

      <AddDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
      />
    </div>
  );
};

export default CompanyProfileDashboard;

export { AddTeamMemberModal, AddCaseStudyModal };
