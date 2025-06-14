// // src/components/ProposalForm.jsx
// import { useForm } from 'react-hook-form';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProposalForm = ({ onSubmit: handleFormSubmit, defaultValues = {}, isEdit = false }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm({ defaultValues });

//   const [fileList, setFileList] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (defaultValues?.uploadedDocuments) {
//       setFileList(defaultValues.uploadedDocuments);
//     }
//   }, [defaultValues]);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFileList(prev => [...prev, ...files]);
//   };

//   const handleRemoveFile = (indexToRemove) => {
//     setFileList(prev => prev.filter((_, i) => i !== indexToRemove));
//   };

//   const processForm = (data) => {
//     const formData = new FormData();
//     for (const key in data) {
//       formData.append(key, data[key]);
//     }
//     fileList.forEach((file) => {
//       if (file instanceof File) {
//         formData.append('projects', file);
//       } else {
//         formData.append('existingFiles', JSON.stringify(file));
//       }
//     });
//     handleFormSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit(processForm)} className="space-y-6">
//       {[
//         { label: "Company Name", name: "companyName", placeholder: "e.g., ABC Solutions Pvt. Ltd." },
//         { label: "Brief Company Overview", name: "companyOverview", textarea: true, placeholder: "Provide a short introduction about your company, services, and goals." },
//         { label: "Mission Statement", name: "mission", textarea: true, placeholder: "e.g., To innovate sustainable and scalable tech solutions." },
//         { label: "Vision Statement", name: "vision", textarea: true, placeholder: "e.g., To become a global leader in AI-powered solutions by 2030." },
//         { label: "Year of Establishment", name: "yearEstablished", placeholder: "e.g., 2015" },
//         { label: "Number of Employees", name: "employeeCount", placeholder: "Enter a number or a range like 50–200" },
//         { label: "Key Team Members (Names, Roles, Qualifications)", name: "teamMembers", textarea: true, placeholder: "e.g., John Doe – CEO, 10+ years in executive leadership; Jane Smith – CTO, extensive experience in technology and innovation" },
//         { label: "Team Experience & Skills", name: "teamExperience", textarea: true, placeholder: "Summarize relevant domain experience and technical skills of your team." },
//         { label: "Certifications & Accreditations", name: "certifications", textarea: true, placeholder: "e.g., ISO 9001:2015, Microsoft Gold Partner" },
//         { label: "Technologies/Tools Used", name: "technologies", textarea: true, placeholder: "e.g., React.js, Node.js, Python, AWS, MongoDB" },
//         { label: "Past Projects & Case Studies", name: "pastProjects", textarea: true, placeholder: "Briefly describe notable past projects and key results." },
//         { label: "Client Portfolio", name: "clientPortfolio", textarea: true, placeholder: "List your key clients or industries served." },
//         { label: "Awards & Recognitions", name: "awards", textarea: true, placeholder: "e.g., Best Startup Award 2023, Nasscom 10000 Startups" },
//         { label: "Compliance Standards Followed (e.g., ISO, GDPR)", name: "complianceStandards", textarea: true, placeholder: "e.g., ISO 27001, GDPR, HIPAA" },
//         { label: "Geographical Presence", name: "geographicalPresence", textarea: true, placeholder: "e.g., India, USA, UK, Middle East" },
//         { label: "Preferred Industries/Sectors", name: "preferredIndustries", textarea: true, placeholder: "e.g., Healthcare, FinTech, EdTech, Government" },
//         { label: "Document Upload Section", name: "documents", fileUpload: true, multiple: true }
//       ].map(({ label, name, textarea, fileUpload, placeholder }) => (
//         <div key={name}>
//           <label className="block font-medium mb-1">{label}</label>
//           {fileUpload ? (
//             <>
//               <p className="mb-1 text-sm text-gray-600">
//                 Upload your company brochure, portfolio, certifications, etc.
//               </p>
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
//               />

//               {isEdit && fileList.length > 0 && (
//                 <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
//                   {fileList.map((file, index) => (
//                     <li key={file.fileId || file.name || index} className="flex justify-between items-center">
//                       {file.fileId ? (
//                         <a
//                           href={`https://proposal-form-backend.vercel.app/api/proposals/file/${file.fileId}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           {file.filename}
//                         </a>
//                       ) : (
//                         <span>{file.name || file.filename}</span>
//                       )}

//                       <button
//                         type="button"
//                         onClick={() => handleRemoveFile(index)}
//                         className="ml-4 text-red-600 hover:text-red-800 text-xs"
//                       >
//                         ❌ Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </>
//           ) : textarea ? (
//             <textarea
//               {...register(name, { required: 'This field is required' })}
//               className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
//               rows={4}
//               placeholder={placeholder}
//             />
//           ) : (
//             <input
//               {...register(name, { required: 'This field is required' })}
//               className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
//               placeholder={placeholder}
//             />
//           )}
//           {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name].message}</p>}
//         </div>
//       ))}

//       <div className="flex flex-row gap-4 mt-6">
//         <button
//           type="button"
//           onClick={() => navigate("/")}
//           className="bg-red-700 px-3 sm:px-6 py-2 rounded-lg text-[16px] text-[#FFFFFF] font-regular"
//         >
//           Back
//         </button>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           {isEdit ? 'Update Proposal' : 'Submit Proposal'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ProposalForm;


// src/components/ProposalForm.jsx
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const ProposalForm = ({ onSubmit: handleFormSubmit, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({ defaultValues });

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [pendingFileList, setPendingFileList] = useState([]);

  // Multi-select states
  const [showOtherIndustryInput, setShowOtherIndustryInput] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [showOtherGeoInput, setShowOtherGeoInput] = useState(false);
  const [otherGeo, setOtherGeo] = useState('');

  const industryOptions = [
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'FinTech', label: 'FinTech' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'E-Commerce', label: 'E-Commerce' },
    { value: 'Government', label: 'Government' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Others', label: 'Others' }
  ];

  const geoOptions = [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'Middle East', label: 'Middle East' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Others', label: 'Others' }
  ];

  useEffect(() => {
    if (defaultValues?.uploadedDocuments) {
      setFileList(defaultValues.uploadedDocuments);
    }

    if (isEdit) {
      // Handle preferred industries
      let industries = defaultValues?.preferredIndustries;
      if (typeof industries === 'string') {
        try {
          industries = JSON.parse(industries);
        } catch {
          industries = [industries];
        }
      }
      if (Array.isArray(industries)) {
        const selected = industries.map((item) => ({
          label: item,
          value: item,
        }));
        setValue("preferredIndustries", selected);
        if (industries.includes("Others")) {
          setShowOtherIndustryInput(true);
          setOtherIndustry(defaultValues.otherIndustry || "");
        }
      }

      // Handle geographical presence
      let geo = defaultValues?.geographicalPresence;
      if (typeof geo === 'string') {
        try {
          geo = JSON.parse(geo);
        } catch {
          geo = [geo];
        }
      }
      if (Array.isArray(geo)) {
        const selectedGeo = geo.map((item) => ({
          label: item,
          value: item,
        }));
        setValue("geographicalPresence", selectedGeo);
        if (geo.includes("Others")) {
          setShowOtherGeoInput(true);
          setOtherGeo(defaultValues.otherGeo || "");
        }
      }
    }
  }, [defaultValues, isEdit, setValue]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPendingFileList(prev => [...prev, ...files]);
  };

  useEffect(() => {
    console.log(pendingFileList);
  }, [pendingFileList])

  const handleSingleFileUpload = (file) => {
    setFileList(prev => [...prev, file]);  // no spread on `file`
    setPendingFileList(prev => prev.filter(f => f !== file)); // optional: remove after uploading
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleRemovePendingFile = (indexToRemove) => {
    setPendingFileList(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const processForm = (data) => {
    const formData = new FormData();

    // Format industries
    const selectedIndustries = (data.preferredIndustries || []).map(i => i.value);
    if (selectedIndustries.includes("Others") && otherIndustry) {
      selectedIndustries[selectedIndustries.indexOf("Others")] = otherIndustry;
    }
    formData.append("preferredIndustries", JSON.stringify(selectedIndustries));

    // Format geographical presence
    const selectedGeo = (data.geographicalPresence || []).map(i => i.value);
    if (selectedGeo.includes("Others") && otherGeo) {
      selectedGeo[selectedGeo.indexOf("Others")] = otherGeo;
    }
    formData.append("geographicalPresence", JSON.stringify(selectedGeo));

    // Append rest of form
    for (const key in data) {
      if (["preferredIndustries", "geographicalPresence"].includes(key)) continue;
      formData.append(key, data[key]);
    }

    // Files
    fileList.forEach((file) => {
      if (file instanceof File) {
        formData.append('projects', file);
      } else {
        formData.append('existingFiles', JSON.stringify(file));
      }
    });

    handleFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-6">
      {[
        { label: "Company Name", name: "companyName", placeholder: "e.g., ABC Solutions Pvt. Ltd." },
        { label: "Brief Company Overview", name: "companyOverview", textarea: true, placeholder: "Provide a short introduction about your company, services, and goals." },
        { label: "Mission Statement", name: "mission", textarea: true, placeholder: "e.g., To innovate sustainable and scalable tech solutions." },
        { label: "Vision Statement", name: "vision", textarea: true, placeholder: "e.g., To become a global leader in AI-powered solutions by 2030." },
        { label: "Year of Establishment", name: "yearEstablished", placeholder: "e.g., 2015" },
        { label: "Number of Employees", name: "employeeCount", type: "select", options: ["1–10", "11–50", "51–200", "201–500", "500+"] },
        { label: "Key Team Members (Names, Roles, Qualifications)", name: "teamMembers", textarea: true, placeholder: "e.g., John Doe – CEO, 10+ years in executive leadership; Jane Smith – CTO, extensive experience in technology and innovation" },
        { label: "Team Experience & Skills", name: "teamExperience", textarea: true, placeholder: "Summarize relevant domain experience and technical skills of your team." },
        { label: "Certifications & Accreditations", name: "certifications", textarea: true, placeholder: "e.g., ISO 9001:2015, Microsoft Gold Partner" },
        { label: "Technologies/Tools Used", name: "technologies", textarea: true, placeholder: "e.g., React.js, Node.js, Python, AWS, MongoDB" },
        { label: "Past Projects & Case Studies", name: "pastProjects", textarea: true, placeholder: "Briefly describe notable past projects and key results." },
        { label: "Client Portfolio", name: "clientPortfolio", textarea: true, placeholder: "List your key clients or industries served." },
        { label: "Awards & Recognitions", name: "awards", textarea: true, placeholder: "e.g., Best Startup Award 2023, Nasscom 10000 Startups" },
        { label: "Compliance Standards Followed (e.g., ISO, GDPR)", name: "complianceStandards", textarea: true, placeholder: "e.g., ISO 27001, GDPR, HIPAA" }
      ].map(({ label, name, textarea, placeholder, type, options }) => (
        <div key={name}>
          <label className="block font-medium mb-1">{label}</label>
          {type === "select" ? (
            <select
              {...register(name, { required: 'This field is required' })}
              className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              defaultValue=""
            >
              <option value="" disabled>Select</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : textarea ? (
            <textarea
              {...register(name, { required: 'This field is required' })}
              className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              rows={4}
              placeholder={placeholder}
            />
          ) : (
            <input
              {...register(name, { required: 'This field is required' })}
              className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              placeholder={placeholder}
            />
          )}
          {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name].message}</p>}
        </div>
      ))}

      {/* Geographical Presence */}
      <div>
        <label className="block font-medium mb-1">Geographical Presence</label>
        <Controller
          name="geographicalPresence"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={geoOptions}
              onChange={(selected) => {
                field.onChange(selected);
                const hasOther = selected?.some(option => option.value === "Others");
                setShowOtherGeoInput(hasOther);
              }}
            />
          )}
        />
        {showOtherGeoInput && (
          <input
            type="text"
            placeholder="Please specify other region"
            value={otherGeo}
            onChange={(e) => setOtherGeo(e.target.value)}
            className="mt-2 w-full border border-gray-300 bg-gray-100 p-3 rounded"
          />
        )}
      </div>

      {/* Preferred Industries */}
      <div>
        <label className="block font-medium mb-1">Preferred Industries/Sectors</label>
        <Controller
          name="preferredIndustries"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={industryOptions}
              onChange={(selected) => {
                field.onChange(selected);
                const hasOther = selected?.some(option => option.value === "Others");
                setShowOtherIndustryInput(hasOther);
              }}
            />
          )}
        />
        {showOtherIndustryInput && (
          <input
            type="text"
            placeholder="Please specify other industry"
            value={otherIndustry}
            onChange={(e) => setOtherIndustry(e.target.value)}
            className="mt-2 w-full border border-gray-300 bg-gray-100 p-3 rounded"
          />
        )}
      </div>

      {/* File Upload */}
      <div>
        <label className="block font-medium mb-1">Document Upload Section</label>
        <p className="mb-1 text-sm text-gray-600">
          Upload your company brochure, portfolio, certifications, etc.
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileChange}
          className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
        />

        {/* Pending files (not yet uploaded) */}
        {pendingFileList.length > 0 && (
          <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
            {pendingFileList.map((file, index) => (
              <li key={file.name || index} className="flex justify-between items-center">
                <span>{file.name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSingleFileUpload(file)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    ⬆️ Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile(index)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ❌ Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Already uploaded files */}
        {fileList.length > 0 && (
          <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
            {fileList.map((file, index) => (
              <li key={file.fileId || file.filename || index} className="flex justify-between items-center">
                <a
                  href={`https://proposal-form-backend.vercel.app/api/proposals/file/${file.fileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.filename}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-4 text-red-600 hover:text-red-800 text-xs"
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4 mt-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-red-700 px-3 sm:px-6 py-2 rounded-lg text-[16px] text-[#FFFFFF] font-regular"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update Proposal' : 'Submit Proposal'}
        </button>
      </div>
    </form>
  );
};

export default ProposalForm;
