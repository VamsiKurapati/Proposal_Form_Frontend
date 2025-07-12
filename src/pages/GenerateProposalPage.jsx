import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import { MdOutlineEdit, MdOutlineAdd, MdOutlineAssignment } from 'react-icons/md';

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
  const proposal = location.state?.proposal;
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      <NavbarComponent />
      <div className="w-full mx-auto px-8 mt-20">
        <h1 className="text-[32px] font-semibold mb-1">{proposal?.title}</h1>

        <p className="text-[#4B5563] text-[20px] mb-6">1. Edit & preview user information</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Company Details */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Company Details</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1">
                <MdOutlineEdit className="w-4 h-4 text-[#2563EB]" />
                Edit</button>
            </div>
            <div className="mb-1">
              <div className="text-[16px] font-medium text-[#6B7280]">Company Name</div>
              <div className=" text-[20px] font-medium text-[#111827]">{companyDetails.name}</div>
            </div>
            <div className="mb-1">
              <div className="text-[16px] font-medium text-[#6B7280]">Industry</div>
              <div className="text-[20px] font-medium text-[#111827]">{companyDetails.industry}</div>
            </div>
            <div className="mb-1">
              <div className="text-[16px] font-medium text-[#6B7280]">Total no. of employees</div>
              <div className="text-[20px] font-medium text-[#111827]">{companyDetails.employees}</div>
            </div>
            <div className="mb-1">
              <div className="text-[16px] font-medium text-[#6B7280]">About</div>
              <div className="text-[#111827] text-[20px] leading-snug">{companyDetails.about}</div>
            </div>
          </div>
          {/* Team Members */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Team Members</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1">
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
            <button className="text-[#2563EB] text-[16px] self-end">View All</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Previous Proposals */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Previous Proposals</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1">
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
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1">
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
          <button className="bg-[#2563EB] text-white px-8 py-2 rounded-lg font-medium text-lg hover:bg-[#1d4ed8]">Save & Next</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateProposalPage;
