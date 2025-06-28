// import { useLocation } from "react-router-dom";
// import { useState } from "react";

// const ProfileForm = () => {
//   const { state } = useLocation();
//   const role = state?.role;

//   const isCompany = role === "company";

//   const [companyForm, setCompanyForm] = useState({
//     companyName: "",
//     industry: "",
//     employees: "",
//     bio: "",
//     documents: [],
//     proposals: [],
//     caseStudies: [""],
//     licenses: [""],
//   });

//   const [employeeForm, setEmployeeForm] = useState({
//     fullName: "",
//     company: "",
//     title: "",
//     email: "",
//     mobile: "",
//     location: "",
//     linkedin: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleCompanyChange = (e) => {
//     const { name, value } = e.target;
//     setCompanyForm({ ...companyForm, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleEmployeeChange = (e) => {
//     const { name, value } = e.target;
//     setEmployeeForm({ ...employeeForm, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isCompany) {
//       // Validate company
//       if (!companyForm.companyName || !companyForm.industry) {
//         setErrors({ companyName: "Required", industry: "Required" });
//         return;
//       }
//       // Submit company profile
//       const data = new FormData();
//       Object.entries(companyForm).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           value.forEach((v) => data.append(`${key}[]`, v));
//         } else {
//           data.append(key, value);
//         }
//       });

//       await fetch("/api/company-profile", {
//         method: "POST",
//         body: data,
//       });
//     } else {
//       // Validate employee
//       if (!employeeForm.fullName || !employeeForm.email) {
//         setErrors({ fullName: "Required", email: "Required" });
//         return;
//       }

//       await fetch("/api/employee-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(employeeForm),
//       });
//     }

//     alert("Submitted!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10">
//       <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md space-y-4">
//         <h2 className="text-2xl font-semibold text-blue-600 mb-2">
//           {isCompany ? "Company Profile" : "Your Profile"}
//         </h2>

//         {isCompany ? (
//           <div className="flex flex-col">
//             <input
//               name="companyName"
//               placeholder="Company Name *"
//               value={companyForm.companyName}
//               onChange={handleCompanyChange}
//               className="input"
//             />
//             <input
//               name="industry"
//               placeholder="Industry/Domain *"
//               value={companyForm.industry}
//               onChange={handleCompanyChange}
//               className="input"
//             />
//             <input
//               name="employees"
//               placeholder="Total Employees *"
//               value={companyForm.employees}
//               onChange={handleCompanyChange}
//               className="input"
//             />
//             <textarea
//               name="bio"
//               placeholder="Company Bio *"
//               value={companyForm.bio}
//               onChange={handleCompanyChange}
//               className="input h-24"
//             />
//             <input type="file" multiple onChange={(e) => setCompanyForm({ ...companyForm, documents: e.target.files })} />
//             <input type="file" multiple onChange={(e) => setCompanyForm({ ...companyForm, proposals: e.target.files })} />
//             <input
//               type="url"
//               placeholder="Case Study Link"
//               value={companyForm.caseStudies[0]}
//               onChange={(e) => setCompanyForm({ ...companyForm, caseStudies: [e.target.value] })}
//               className="input"
//             />
//             <input
//               type="url"
//               placeholder="Certification Link"
//               value={companyForm.licenses[0]}
//               onChange={(e) => setCompanyForm({ ...companyForm, licenses: [e.target.value] })}
//               className="input"
//             />
//           </div>
//         ) : (
//           <div className="flex flex-col">
//             <input
//               name="fullName"
//               placeholder="Full Name *"
//               value={employeeForm.fullName}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//             <input
//               name="company"
//               placeholder="Company Name *"
//               value={employeeForm.company}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//             <input
//               name="email"
//               type="email"
//               placeholder="Email ID *"
//               value={employeeForm.email}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//             <input
//               name="mobile"
//               placeholder="Mobile No. *"
//               value={employeeForm.mobile}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//             <input
//               name="location"
//               placeholder="Location *"
//               value={employeeForm.location}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//             <input
//               name="linkedin"
//               placeholder="LinkedIn *"
//               value={employeeForm.linkedin}
//               onChange={handleEmployeeChange}
//               className="input"
//             />
//           </div>
//         )}

//         <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
//           Create profile
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfileForm;


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// const CreateProfile = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const role = state?.role;

//   const [form, setForm] = useState({
//     // Common Fields
//     companyName: "",

//     // Company Fields
//     industry: "",
//     employees: "",
//     bio: "",
//     caseStudies: [""],
//     licenses: [""],

//     // Employee Fields
//     fullName: "",
//     location: "",
//     email: "",
//     jobTitle: "",
//     mobile: "",
//     linkedin: "",
//   });

//   const [documents, setDocuments] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (!role) navigate("/signup");
//   }, [role, navigate]);

//   const handleSingleFileUpload = (e, type) => {
//     const files = Array.from(e.target.files);
//     const validFiles = files.filter(file => file.size <= 15 * 1024 * 1024);
//     const oversizedFiles = files.filter(file => file.size > 15 * 1024 * 1024);

//     if (oversizedFiles.length > 0) {
//       alert("Some files exceeded 15MB and were not added.");
//     }

//     if (type === "documents") {
//       setDocuments(prev => [...prev, ...validFiles]);
//     } else if (type === "proposals") {
//       setProposals(prev => [...prev, ...validFiles]);
//     }
//   };

//   const handleRemoveFile = (index, type) => {
//     if (type === "documents") {
//       setDocuments(prev => prev.filter((_, i) => i !== index));
//     } else if (type === "proposals") {
//       setProposals(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   const handleLinkChange = (index, type, value) => {
//     setForm(prev => {
//       const updated = [...prev[type]];
//       updated[index] = value;
//       return { ...prev, [type]: updated };
//     });
//   };

//   const handleAddLink = (type) => {
//     if (form[type].length < 5) {
//       setForm(prev => ({ ...prev, [type]: [...prev[type], ""] }));
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (role === "company") {
//         const formData = new FormData();
//         formData.append("companyName", form.companyName);
//         formData.append("industry", form.industry);
//         formData.append("employees", form.employees);
//         formData.append("bio", form.bio);
//         documents.forEach(file => formData.append("documents", file));
//         proposals.forEach(file => formData.append("proposals", file));
//         form.caseStudies.forEach(link => formData.append("caseStudies", link));
//         form.licenses.forEach(link => formData.append("licenses", link));

//         await axios.post("/api/profile/company", formData);
//       } else {
//         await axios.post("/api/profile/employee", {
//           fullName: form.fullName,
//           location: form.location,
//           companyName: form.companyName,
//           email: form.email,
//           jobTitle: form.jobTitle,
//           mobile: form.mobile,
//           linkedin: form.linkedin,
//         });
//       }
//       alert("Profile created successfully");
//     } catch (err) {
//       alert("Submission failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//         {role === "company" ? "Company Profile" : "Your Profile"}
//       </h2>
//       <p className="text-[16px] text-[#4B5563] mb-1">
//         {role === "company" ? "Enter all the company details to get started with RFPs." : "Enter all your details to complete your account."}
//       </p>
//       <p className="font-medium italic text-[14px] text-[#9CA3AF] mb-6">
//        (* All fields are mandatory.)
//       </p>

//       {role === "company" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="col-span-2">
//             <label className="text-[24px] font-medium text-[#111827]">Company Name *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter the company/organization name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Industry/Domain *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter the domain" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Total no. of employees *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="eg. 50-100" value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })} />
//           </div>

//           <div className="col-span-2">
//             <label className="text-[24px] font-medium text-[#111827]">Bio *</label>
//             <textarea className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter about the company" rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
//           </div>

//           {[{ type: "documents", label: "Company Documents" }, { type: "proposals", label: "Proposals" }].map(section => (
//             <div key={section.type} className="col-span-2 md:col-span-1">
//               <label className="block text-[24px] font-medium mb-1">{section.label} *</label>
//               <p className="mb-1 text-sm text-gray-600">Upload related files (max 15MB each)</p>
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 multiple
//                 onChange={e => handleSingleFileUpload(e, section.type)}
//                 className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
//               />
//               {(section.type === "documents" ? documents : proposals).length > 0 && (
//                 <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
//                   {(section.type === "documents" ? documents : proposals).map((file, index) => (
//                     <li key={file.name + index} className="flex justify-between items-center">
//                       <span>{file.name}</span>
//                       <button type="button" onClick={() => handleRemoveFile(index, section.type)} className="ml-4 text-red-600 hover:text-red-800 text-xs">❌ Remove</button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}

//           {[{ key: "caseStudies", label: "Case Studies" }, { key: "licenses", label: "Certifications/Licenses" }].map(linkField => (
//             <div key={linkField.key} className="col-span-2 md:col-span-1">
//               <label className="text-[24px] font-medium text-[#111827]">{linkField.label} (max 5 links) *</label>
//               {form[linkField.key].map((link, index) => (
//                 <input
//                   key={index}
//                   type="url"
//                   className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]"
//                   placeholder={`Enter ${linkField.label.toLowerCase()} link #${index + 1}`}
//                   value={link}
//                   onChange={(e) => handleLinkChange(index, linkField.key, e.target.value)}
//                 />
//               ))}
//               {form[linkField.key].length < 5 && (
//                 <button type="button" onClick={() => handleAddLink(linkField.key)} className="mt-1 text-blue-600 text-sm underline">+ Add Link</button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="col-span-2 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Full Name *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Location *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Company Name *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter company name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Email ID *</label>
//             <input type="email" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Job Title *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter job title" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">Mobile No. *</label>
//             <input type="tel" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter mobile number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
//           </div>

//           <div className="col-span-2 md:col-span-1 mt-4">
//             <label className="text-[24px] font-medium text-[#111827]">LinkedIn *</label>
//             <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" placeholder="Enter LinkedIn profile" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
//           </div>
//         </div>
//       )}

//       <div className="mt-6 flex justify-end gap-3">
//         <button className="px-4 py-2 rounded bg-gray-200" onClick={() => navigate(-1)}>Cancel</button>
//         <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>Create profile</button>
//       </div>
//     </div>
//   );
// };

// export default CreateProfile;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProfile = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const role = state?.role;
// //   const role = "company";

//   const [form, setForm] = useState({
//     companyName: "",
//     industry: "",
//     employees: "",
//     bio: "",
//     caseStudies: [""],
//     licenses: [""],
//     fullName: "",
//     location: "",
//     email: "",
//     jobTitle: "",
//     mobile: "",
//     linkedin: "",
//   });

//   const [documents, setDocuments] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [highlightedFile, setHighlightedFile] = useState(null);

//   useEffect(() => {
//     if (!role) navigate("/signup");
//   }, [role, navigate]);

//   const handleSingleFileUpload = (e, type) => {
//     const files = Array.from(e.target.files);
//     const validFiles = files.filter(file => file.size <= 15 * 1024 * 1024);
//     const oversizedFiles = files.filter(file => file.size > 15 * 1024 * 1024);
//     if (oversizedFiles.length > 0) alert("Some files exceeded 15MB and were not added.");
//     if (type === "documents") setDocuments(prev => [...prev, ...validFiles]);
//     else if (type === "proposals") setProposals(prev => [...prev, ...validFiles]);
//   };

//   const handleRemoveFile = (index, type) => {
//     if (type === "documents") setDocuments(prev => prev.filter((_, i) => i !== index));
//     else if (type === "proposals") setProposals(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleLinkChange = (index, type, value) => {
//     setForm(prev => {
//       const updated = [...prev[type]];
//       updated[index] = value;
//       return { ...prev, [type]: updated };
//     });
//   };

//   const handleAddLink = (type) => {
//     if (form[type].length < 5) {
//       setForm(prev => ({ ...prev, [type]: [...prev[type], ""] }));
//     }
//   };

//   const handleRemoveLink = (index, type) => {
//     setForm(prev => {
//       const updated = prev[type].filter((_, i) => i !== index);
//       return { ...prev, [type]: updated };
//     });
//   };

//   const handleFilePreview = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     const previewWindow = window.open(fileURL, "_blank");
//     previewWindow.onload = () => {
//         URL.revokeObjectURL(fileURL);
//     };
//   };

//   const handleSubmit = async () => {
//     try {
//       if (role === "company") {
//         const formData = new FormData();
//         formData.append("companyName", form.companyName);
//         formData.append("industry", form.industry);
//         formData.append("employees", form.employees);
//         formData.append("bio", form.bio);
//         documents.forEach(file => formData.append("documents", file));
//         proposals.forEach(file => formData.append("proposals", file));
//         form.caseStudies.forEach(link => formData.append("caseStudies", link));
//         form.licenses.forEach(link => formData.append("licenses", link));
//         await axios.post("/api/profile/company", formData);
//       } else {
//         await axios.post("/api/profile/employee", {
//           fullName: form.fullName,
//           location: form.location,
//           companyName: form.companyName,
//           email: form.email,
//           jobTitle: form.jobTitle,
//           mobile: form.mobile,
//           linkedin: form.linkedin,
//         });
//       }
//       alert("Profile created successfully");
//     } catch (err) {
//       alert("Submission failed");
//     }
//   };




//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const role = state?.role;
//     // const role="company";
//   const signupData = state?.signupData;

//   const [form, setForm] = useState({
//     companyName: signupData?.companyName || signupData?.organization || "",
//     industry: "",
//     employees: "",
//     bio: "",
//     caseStudies: [""],
//     licenses: [""],
//     fullName: signupData?.fullName || "",
//     location: "",
//     email: signupData?.email || "",
//     jobTitle: "",
//     mobile: signupData?.mobile || "",
//     linkedin: "",
//   });

//   const [documents, setDocuments] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (!role) navigate("/sign_up");
//   }, [role, navigate]);

//   const handleSingleFileUpload = (e, type) => {
//     const files = Array.from(e.target.files);
//     const validFiles = files.filter(file => file.size <= 15 * 1024 * 1024);
//     const oversizedFiles = files.filter(file => file.size > 15 * 1024 * 1024);

//     if (oversizedFiles.length > 0) {
//       alert("Some files exceeded 15MB and were not added.");
//     }

//     if (type === "documents") {
//       setDocuments(prev => [...prev, ...validFiles]);
//     } else if (type === "proposals") {
//       setProposals(prev => [...prev, ...validFiles]);
//     }
//   };

//   const handleRemoveFile = (index, type) => {
//     if (type === "documents") {
//       setDocuments(prev => prev.filter((_, i) => i !== index));
//     } else if (type === "proposals") {
//       setProposals(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   const handleFilePreview = (file) => {
//     const fileURL = URL.createObjectURL(file);
//     const newWindow = window.open(fileURL, "_blank");
//     newWindow.onload = () => URL.revokeObjectURL(fileURL);
//   };

//   const handleLinkChange = (index, type, value) => {
//     setForm(prev => {
//       const updated = [...prev[type]];
//       updated[index] = value;
//       return { ...prev, [type]: updated };
//     });
//   };

//   const handleAddLink = (type) => {
//     if (form[type].length < 5) {
//       setForm(prev => ({ ...prev, [type]: [...prev[type], ""] }));
//     }
//   };

//   const handleRemoveLink = (index, type) => {
//     setForm(prev => {
//       const updated = [...prev[type]];
//       updated.splice(index, 1);
//       return { ...prev, [type]: updated };
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("role", role);
//       if (signupData) {
//         formData.append("email", signupData.email);
//         formData.append("password", signupData.password);
//         formData.append("fullName", signupData.fullName);
//         formData.append("mobile", signupData.mobile);
//         formData.append("company", signupData.organization);
//       }
//       if (role === "company") {
//         formData.append("companyName", form.companyName);
//         formData.append("industry", form.industry);
//         formData.append("employees", form.employees);
//         formData.append("bio", form.bio);

//         documents.forEach(file => formData.append("documents", file));
//         proposals.forEach(file => formData.append("proposals", file));
//         form.caseStudies.forEach(link => formData.append("caseStudies", link));
//         form.licenses.forEach(link => formData.append("licenses", link));
//       } else {
//           formData.append("location", form.location);
//           formData.append("jobTitle", form.jobTitle);
//           formData.append("linkedin", form.linkedin);
//       };
//       const res = await axios.post("httsp://proposal-form-backend.vercel.app/api/auth/signup", formData);
//       if(res.status===201){
//         alert("Profile created successfully");
//       }
//     } catch (err) {
//       alert("Submission failed");
//     }
//   };



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
            <label className="text-[24px] font-medium text-[#111827]">Industry *</label>
            <input type="text" className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0]" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
          </div>

          <div>
            <label className="text-[24px] font-medium text-[#111827]">Employees *</label>
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
