import { useState } from "react";

const CompanyProfile = () => {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employees, setEmployees] = useState("");
  const [bio, setBio] = useState("");

  const [companyDocs, setCompanyDocs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [caseStudies, setCaseStudies] = useState([""]);
  const [certifications, setCertifications] = useState([""]);

  const handleFileChange = (e, setter, max = 5) => {
    const files = Array.from(e.target.files);
    setter(prev => [...prev, ...files].slice(0, max));
  };

  const handleLinkChange = (index, value, setter) => {
    setter(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addLink = (setter, max = 5) => {
    setter(prev => (prev.length < max ? [...prev, ""] : prev));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-blue-600 mb-1">Company Profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter all the company details to get started with RFPs. (<span className="italic">* All fields are mandatory.</span>)
        </p>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Company Name *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2" placeholder="Enter the company/organization name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Total no. of employees *</label>
            <select className="w-full border rounded-md mt-1 p-2" value={employees} onChange={e => setEmployees(e.target.value)}>
              <option value="">Select</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-100">51–100</option>
              <option value="101-500">101–500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Industry/Domain *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2" placeholder="Enter the domain the company belongs" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium">Bio *</label>
          <textarea className="w-full border rounded-md mt-1 p-2 h-24" placeholder="Enter about the company" value={bio} onChange={e => setBio(e.target.value)} />
        </div>

        {/* Upload Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Company Docs */}
          <div>
            <label className="text-sm font-medium">Company Documents *</label>
            <input type="file" multiple onChange={(e) => handleFileChange(e, setCompanyDocs)} className="mt-2" />
            <p className="text-xs text-gray-400">Max 5 files</p>
          </div>

          {/* Proposals */}
          <div>
            <label className="text-sm font-medium">Proposals *</label>
            <input type="file" multiple onChange={(e) => handleFileChange(e, setProposals)} className="mt-2" />
            <p className="text-xs text-gray-400">Max 5 files</p>
          </div>

          {/* Case Studies */}
          <div>
            <label className="text-sm font-medium">Case Studies *</label>
            {caseStudies.map((link, index) => (
              <input key={index} type="url" className="w-full border rounded-md mt-2 p-2" placeholder="Add link" value={link} onChange={(e) => handleLinkChange(index, e.target.value, setCaseStudies)} />
            ))}
            <button onClick={() => addLink(setCaseStudies)} className="text-blue-600 text-sm mt-1">+ Add Link</button>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-sm font-medium">Certifications/Licenses *</label>
            {certifications.map((link, index) => (
              <input key={index} type="url" className="w-full border rounded-md mt-2 p-2" placeholder="Add link" value={link} onChange={(e) => handleLinkChange(index, e.target.value, setCertifications)} />
            ))}
            <button onClick={() => addLink(setCertifications)} className="text-blue-600 text-sm mt-1">+ Add Link</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md">Cancel</button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">Create profile</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
