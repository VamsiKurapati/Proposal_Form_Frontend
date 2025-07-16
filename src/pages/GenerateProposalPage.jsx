import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import { MdOutlineEdit, MdOutlineAdd, MdOutlineAssignment } from 'react-icons/md';
import { useProfile } from '../context/ProfileContext';

const companyDetails = {
  name: 'ABC Company Inc.',
  industry: 'IT Technology & Consulting',
  employees: '50-100',
  about:
    'ABC Company Inc. is a leading technology consulting firm specializing in digital transformation, cloud solutions and enterprise software development. With over 15 years of experience, we help businesses leverage technology to achieve their strategic objectives.',
};

const teamMembers = [
  { name: 'Sara Johnson', role: 'CEO & Founder', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Theresa Webb', role: 'Web Designer', img: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Devon Lane', role: 'Nursing Assistant', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Wade Warren', role: 'President of Sales', img: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { name: 'Annette Black', role: 'Medical Assistant', img: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { name: 'Ariene McCoy', role: 'Scrum Master', img: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { name: 'Floyd Miles', role: 'Nursing Assistant', img: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { name: 'Arlene McCoy', role: 'Dog Trainer', img: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { name: 'Albert Flores', role: 'Medical Assistant', img: 'https://randomuser.me/api/portraits/men/9.jpg' },
  { name: 'Eleanor Pena', role: 'Dog Trainer', img: 'https://randomuser.me/api/portraits/women/10.jpg' },
];

const previousProposals = [
  { title: 'Walmart Fuel Station', company: 'Biffco Enterprises Ltd.' },
  { title: 'Affordable Housing Project', company: 'Binford Ltd.' },
  { title: 'Civic Center Redevelopment - Design and Build', company: 'Big Kahuna Burger Ltd.' },
  { title: 'Mixed-Use Development Opportunity', company: 'Binford Ltd.' },
];

const caseStudies = [
  { title: 'Optimizing Client Portals for SwiftConsult Tech Solutions', company: 'Biffco Enterprises Ltd.' },
  { title: 'Creating Custom AI Analytics Tools for AdSmart Media', company: 'Barone LLC.' },
  { title: 'Reducing Errors with InventorySync for GlobalTrade', company: 'Acme Co.' },
  { title: 'Building Seamless Real Estate Tools for SmartLiving', company: 'Abstergo Ltd.' },
];

const GenerateProposalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const proposal = location.state?.proposal;
  const { companyData, loading, error, refreshProfile } = useProfile();

  // Modal and form state
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showViewAllTeam, setShowViewAllTeam] = useState(false);
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);

  // Placeholder handlers for saving
  const handleSaveAndNext = () => {
    // Save logic here (API call or context update)
    // For now, just navigate to a placeholder next page
    navigate('/next-step');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-10">
      <NavbarComponent />
      <div className="w-full mx-auto px-8 mt-20">
        <h1 className="text-[32px] font-semibold mb-1">{proposal?.title}</h1>

        <p className="text-[#4B5563] text-[20px] mb-6">1. Edit & preview user information</p>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Company Details */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-[24px]">Company Details</h2>
                  <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => setShowEditCompany(true)}>
                    <MdOutlineEdit className="w-4 h-4 text-[#2563EB]" />
                    Edit</button>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Company Name</div>
                  <div className=" text-[20px] font-medium text-[#111827]">{companyData?.companyName || companyDetails.name}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Industry</div>
                  <div className="text-[20px] font-medium text-[#111827]">{companyData?.industry || companyDetails.industry}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Total no. of employees</div>
                  <div className="text-[20px] font-medium text-[#111827]">{companyData?.companyDetails?.["No.of employees"]?.value || companyDetails.employees}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">About</div>
                  <div className="text-[#111827] text-[20px] leading-snug">{companyData?.profile?.bio || companyDetails.about}</div>
                </div>
              </div>
              {/* Team Members */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-[24px]">Team Members</h2>
                  <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => setShowAddTeam(true)}>
                    <MdOutlineAdd className="w-4 h-4 text-[#2563EB]" />
                    Add</button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {teamMembers.slice(0, 9).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#F8F9FA] rounded-lg px-2 py-1">
                      <img src={member.img} alt={member.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <div className="text-[16px] font-medium text-[#111827]">{member.name}</div>
                        <div className="text-[14px] text-[#4B5563]">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-[#2563EB] text-[16px] self-end" onClick={() => setShowViewAllTeam(true)}>View All</button>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Previous Proposals */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Previous Proposals</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => setShowAddProposal(true)}>
                <MdOutlineAdd className="w-4 h-4 text-[#2563EB]" />
                Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {previousProposals.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                  <MdOutlineAssignment className="w-6 h-6 text-[#2563EB] shrink-0" />
                  <div className='w-full flex flex-col truncate'>
                    <div className="text-[20px] font-medium text-[#111827]">{p.title}</div>
                    <div className="text-[16px] text-[#9CA3AF]">{p.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Case Studies */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Case Studies</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => setShowAddCaseStudy(true)}>
                <MdOutlineAdd className="w-4 h-4 text-[#2563EB]" />
                Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {caseStudies.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                  <MdOutlineAssignment className="w-6 h-6 text-[#2563EB] shrink-0" />
                  <div className='w-full flex flex-col truncate'>
                    <div className="text-[16px] font-medium text-[#111827] truncate">{c.title}</div>
                    <div className="text-[14px] text-[#9CA3AF]">{c.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-[#2563EB] text-white px-8 py-2 rounded-lg font-medium text-lg hover:bg-[#1d4ed8]" onClick={handleSaveAndNext}>Save & Next</button>
        </div>
      </div>
      {/* Modals */}
      {showEditCompany && (
        <Modal onClose={() => setShowEditCompany(false)} title="Edit Company Details">
          <div>Edit Company Details Form (to be implemented)</div>
        </Modal>
      )}
      {showAddTeam && (
        <Modal onClose={() => setShowAddTeam(false)} title="Add Team Member">
          <div>Add Team Member Form (to be implemented)</div>
        </Modal>
      )}
      {showViewAllTeam && (
        <Modal onClose={() => setShowViewAllTeam(false)} title="All Team Members">
          <div>All Team Members List (to be implemented)</div>
        </Modal>
      )}
      {showAddProposal && (
        <Modal onClose={() => setShowAddProposal(false)} title="Add Previous Proposal">
          <div>Add Previous Proposal Form (to be implemented)</div>
        </Modal>
      )}
      {showAddCaseStudy && (
        <Modal onClose={() => setShowAddCaseStudy(false)} title="Add Case Study">
          <div>Add Case Study Form (to be implemented)</div>
        </Modal>
      )}
    </div>
  );
};

// Simple Modal component
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      {children}
    </div>
  </div>
);

export default GenerateProposalPage;
