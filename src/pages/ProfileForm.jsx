import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role;
  const signupData = state?.signupData;

  const [form, setForm] = useState({
    companyName: signupData?.organization || "",
    industry: "",
    employees: "",
    bio: "",
    caseStudies: [""],
    licenses: [""],
    fullName: signupData?.fullName || "",
    location: "",
    email: signupData?.email || "",
    jobTitle: "",
    mobile: signupData?.mobile || "",
    linkedin: "",
  });

  const [documents, setDocuments] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!role) navigate("/signup");
  }, [role, navigate]);

  const handleSingleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 15 * 1024 * 1024);
    const oversizedFiles = files.filter(file => file.size > 15 * 1024 * 1024);
    if (oversizedFiles.length > 0) alert("Some files exceeded 15MB and were not added.");
    if (type === "documents") setDocuments(prev => [...prev, ...validFiles]);
    else if (type === "proposals") setProposals(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index, type) => {
    if (type === "documents") setDocuments(prev => prev.filter((_, i) => i !== index));
    else if (type === "proposals") setProposals(prev => prev.filter((_, i) => i !== index));
  };

  const handleFilePreview = (file) => {
    const fileURL = URL.createObjectURL(file);
    const previewWindow = window.open(fileURL, "_blank");
    if (previewWindow) {
      previewWindow.onload = () => URL.revokeObjectURL(fileURL);
    }
  };

  const handleLinkChange = (index, type, value) => {
    setForm(prev => {
      const updated = [...prev[type]];
      updated[index] = value;
      return { ...prev, [type]: updated };
    });
  };

  const handleAddLink = (type) => {
    if (form[type].length < 5) {
      setForm(prev => ({ ...prev, [type]: [...prev[type], ""] }));
    }
  };

  const handleRemoveLink = (index, type) => {
    setForm(prev => {
      const updated = prev[type].filter((_, i) => i !== index);
      return { ...prev, [type]: updated };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (role === "company") {
      if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!form.industry.trim()) newErrors.industry = "Industry is required";
      if (!form.employees.trim()) newErrors.employees = "Number of employees is required";
      if (!form.bio.trim()) newErrors.bio = "Bio is required";
      if (documents.length === 0) newErrors.documents = "At least one document is required";
      if (proposals.length === 0) newErrors.proposals = "At least one proposal is required";
      if (!form.caseStudies.length || form.caseStudies.some(link => !link.trim())) {
        newErrors.caseStudies = "At least one valid case study link is required";
      }
      if (!form.licenses.length || form.licenses.some(link => !link.trim())) {
        newErrors.licenses = "At least one valid certification/license link is required";
      }
    } else {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!form.location.trim()) newErrors.location = "Location is required";
      if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!form.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
      if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
      if (!form.linkedin.trim()) newErrors.linkedin = "LinkedIn is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("email", signupData?.email || form.email);
      formData.append("password", signupData?.password || "");
      formData.append("fullName", signupData?.fullName || form.fullName);
      formData.append("mobile", signupData?.mobile || form.mobile);

      if (role === "company") {
        formData.append("companyName", form.companyName);
        formData.append("industry", form.industry);
        formData.append("employees", form.employees);
        formData.append("bio", form.bio);
        form.caseStudies.forEach(link => formData.append("caseStudies", link));
        form.licenses.forEach(link => formData.append("licenses", link));
        documents.forEach(file => formData.append("documents", file));
        proposals.forEach(file => formData.append("proposals", file));
      } else {
        formData.append("companyName", form.companyName);
        formData.append("location", form.location);
        formData.append("jobTitle", form.jobTitle);
        formData.append("linkedin", form.linkedin);
      }

      const res = await axios.post("https://proposal-form-backend.vercel.app/api/auth/signup", formData);

      if (res.status === 201) {
        alert("Profile created successfully");
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {role === "company" ? "Company Profile" : "Your Profile"}
      </h2>
      <p className="text-[16px] text-[#4B5563] mb-1">
        {role === "company"
          ? "Enter all the company details to get started with RFPs."
          : "Enter all your details to complete your account."}
      </p>
      <p className="font-medium italic text-[14px] text-[#9CA3AF] mb-6">
        (* All fields are mandatory.)
      </p>

      {role === "company" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Inputs */}
          <div className="col-span-2">
            <label className="text-[24px] font-medium text-[#111827]">Company Name *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
          </div>

          <div>
            <label className="text-[24px] font-medium text-[#111827]">Industry/Domain *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
          </div>

          <div>
            <label className="text-[24px] font-medium text-[#111827]">Total no.of Employees *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })} />
          </div>

          <div className="col-span-2">
            <label className="text-[24px] font-medium text-[#111827]">Bio *</label>
            <textarea className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          {/* Files */}
          {[{ type: "documents", label: "Company Documents" }, { type: "proposals", label: "Proposals" }].map(section => (
            <div key={section.type}>
              <label className="block text-[24px] font-medium mb-1">{section.label} *</label>
              <p className="text-sm text-gray-600 mb-1">Upload files (max 15MB each)</p>
              <input type="file" accept=".pdf,.doc,.docx" multiple onChange={e => handleSingleFileUpload(e, section.type)} className="w-full border p-2 rounded bg-gray-100" />
              <ul className="mt-2 space-y-1 text-sm">
                {(section.type === "documents" ? documents : proposals).map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded 'bg-blue-100">
                    <button type="button" onClick={() => handleFilePreview(file)} className="text-blue-600 underline truncate w-full text-left">
                      {file.name}
                    </button>
                    <button type="button" onClick={() => handleRemoveFile(index, section.type)} className="ml-2 text-red-600 text-xs">❌</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {[{ key: "caseStudies", label: "Case Studies" }, { key: "licenses", label: "Certifications/Licenses" }].map(field => (
            <div key={field.key}>
              <label className="text-[24px] font-medium text-[#111827] mr-4">{field.label} *</label>
              {form[field.key].map((link, index) => (
                <div key={index} className="flex gap-2 items-center mb-1">
                  <input type="url" value={link} placeholder={`Enter ${field.label.toLowerCase()} #${index + 1}`} onChange={e => handleLinkChange(index, field.key, e.target.value)} className="w-full border rounded-md p-2 bg-[#F0F0F0]" />
                  <button type="button" onClick={() => handleRemoveLink(index, field.key)} className="text-red-600 text-xs">❌</button>
                </div>
              ))}
              {form[field.key].length < 5 && (
                <button type="button" onClick={() => handleAddLink(field.key)} className="text-blue-600 text-sm mt-1">+ Add Link</button>
              )}
            </div>
          ))}
        </div>
      )}

      {role === "employee" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ key: "fullName", label: "Full Name" }, { key: "location", label: "Location" }, { key: "companyName", label: "Company Name" }, { key: "email", label: "Email" }, { key: "jobTitle", label: "Job Title" }, { key: "mobile", label: "Mobile" }, { key: "linkedin", label: "LinkedIn" }].map(field => (
            <div key={field.key}>
              <label className="text-[24px] font-medium text-[#111827]">{field.label} *</label>
              <input type="text" value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 rounded bg-gray-200" onClick={() => navigate(-1)}>Cancel</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>Create profile</button>
      </div>
    </div>
  );
};

export default CreateProfile;
