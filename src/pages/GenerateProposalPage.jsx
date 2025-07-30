import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import { MdOutlineEdit, MdOutlineAdd, MdOutlineAssignment } from 'react-icons/md';
import { useProfile } from '../context/ProfileContext';
import { AddTeamMemberModal, AddCaseStudyModal } from './CompanyProfileDashboard';

const GenerateProposalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const proposal = location.state?.proposal;
  const { companyData, loading, error } = useProfile();

  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showViewAllTeam, setShowViewAllTeam] = useState(false);
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);

  const handleSaveAndNext = async () => {
    try {
      // const res = await axios.get(`http://56.228.64.88:5000/run-proposal-generation`, { proposal} , {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });

      const token = localStorage.getItem("token");
      const res = await axios.post(`https://proposal-form-backend.vercel.app/api/rfp/sendDataForProposalGeneration`, {
        proposal,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("Company data saved successfully");
      }
    } catch (error) {
      console.error("Error saving company data:", error);
    }
    console.log("Save and Next");
    navigate('/company_profile_dashboard');
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
        ) : error ? (
          <div className="text-red-500 text-center py-4">Error loading company data</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Company Details */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-[24px]">Company Details</h2>
                  <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => navigate('/company-profile-update')}>
                    <MdOutlineEdit className="w-4 h-4 text-[#2563EB]" />
                    Edit</button>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Company Name</div>
                  <div className=" text-[20px] font-medium text-[#111827]">{companyData?.companyName}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Industry</div>
                  <div className="text-[20px] font-medium text-[#111827]">{companyData?.industry}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">Total no. of employees</div>
                  <div className="text-[20px] font-medium text-[#111827]">{companyData?.companyDetails?.["No.of employees"]?.value}</div>
                </div>
                <div className="mb-1">
                  <div className="text-[16px] font-medium text-[#6B7280]">About</div>
                  <div className="text-[#111827] text-[20px] leading-snug">{companyData?.profile?.bio}</div>
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
                {companyData?.employees && companyData?.employees.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {showViewAllTeam === false && companyData?.employees && companyData?.employees.slice(0, 9).map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#F8F9FA] rounded-lg px-2 py-1">
                          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover min-w-[40px] min-h-[40px]" />
                            ) : (
                              member.name.split(' ').map(n => n[0]).join('')
                            )}
                          </div>
                          <div>
                            <div className="text-[16px] font-medium text-[#111827]">{member.name}</div>
                            <div className="text-[14px] text-[#4B5563]">{member.jobTitle}</div>
                          </div>
                        </div>
                      ))}
                      {showViewAllTeam === true && companyData?.employees && companyData?.employees.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#F8F9FA] rounded-lg px-2 py-1">
                          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover min-w-[40px] min-h-[40px]" />
                            ) : (
                              member.name.split(' ').map(n => n[0]).join('')
                            )}
                          </div>
                          <div>
                            <div className="text-[16px] font-medium text-[#111827]">{member.name}</div>
                            <div className="text-[14px] text-[#4B5563]">{member.jobTitle}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="text-[#2563EB] text-[16px] self-end" onClick={() => setShowViewAllTeam(!showViewAllTeam)}> {showViewAllTeam ? "View Less" : "View All"}</button>
                  </>
                ) : (
                  <div className="text-[16px] text-[#4B5563]">No team members found</div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Previous Proposals */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Previous Proposals</h2>
            </div>
            {companyData?.proposalsList && companyData?.proposalsList.length > 0 ? (
              <div className="flex flex-col gap-2">
                {companyData?.proposalsList && companyData?.proposalsList.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                    <MdOutlineAssignment className="w-6 h-6 text-[#2563EB] shrink-0" />
                    <div className='w-full flex flex-col truncate'>
                      <div className="text-[20px] font-medium text-[#111827]">{p.title}</div>
                      <div className="text-[16px] text-[#9CA3AF]">{p.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[16px] text-[#4B5563]">No previous proposals found</div>
            )}
          </div>

          {/* Case Studies */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[24px]">Case Studies</h2>
              <button className="text-[#2563EB] font-medium text-[16px] flex items-center gap-1" onClick={() => setShowAddCaseStudy(true)}>
                <MdOutlineAdd className="w-4 h-4 text-[#2563EB]" />
                Add</button>
            </div>
            {companyData?.caseStudiesList && companyData?.caseStudiesList.length > 0 ? (
              <div className="flex flex-col gap-2">
                {companyData?.caseStudiesList && companyData?.caseStudiesList.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                    <MdOutlineAssignment className="w-6 h-6 text-[#2563EB] shrink-0" />
                    <div className='w-full flex flex-col truncate'>
                      <div className="text-[16px] font-medium text-[#111827] truncate">{c.title}</div>
                      <div className="text-[14px] text-[#9CA3AF]">{c.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[16px] text-[#4B5563]">No case studies found</div>
            )}
          </div>
        </div>

        {/* Save & Next Button */}
        <div className="flex justify-end">
          <button className="bg-[#2563EB] text-white px-8 py-2 rounded-lg font-medium text-lg hover:bg-[#1d4ed8]" onClick={handleSaveAndNext}>Save & Next</button>
        </div>
      </div>

      <AddTeamMemberModal isOpen={showAddTeam} onClose={() => setShowAddTeam(false)} />
      <AddCaseStudyModal isOpen={showAddCaseStudy} onClose={() => setShowAddCaseStudy(false)} />

    </div>
  );
};

export default GenerateProposalPage;
