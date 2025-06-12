// src/components/ProposalForm.jsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProposalForm = ({ onSubmit: handleFormSubmit, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues });

  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (defaultValues?.uploadedDocuments) {
      setFileList(defaultValues.uploadedDocuments);
    }
  }, [defaultValues]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const processForm = (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
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
          { label: "Company Name", name: "companyName" },
          { label: "Brief Company Overview", name: "companyOverview", textarea: true },
          { label: "Mission Statement", name: "mission", textarea: true },
          { label: "Vision Statement", name: "vision", textarea: true },
          { label: "Year of Establishment", name: "yearEstablished" },
          { label: "Number of Employees", name: "employeeCount" },
          { label: "Key Team Members (Names, Roles, Qualifications)", name: "teamMembers", textarea: true },
          { label: "Team Experience & Skills", name: "teamExperience", textarea: true },
          { label: "Certifications & Accreditations", name: "certifications", textarea: true },
          { label: "Technologies/Tools Used", name: "technologies", textarea: true },
          { label: "Past Projects & Case Studies", name: "pastProjects", textarea: true },
          { label: "Client Portfolio", name: "clientPortfolio", textarea: true },
          { label: "Awards & Recognitions", name: "awards", textarea: true },
          { label: "Compliance Standards Followed (e.g., ISO, GDPR)", name: "complianceStandards", textarea: true },
          { label: "Geographical Presence", name: "geographicalPresence", textarea: true },
          { label: "Preferred Industries/Sectors", name: "preferredIndustries", textarea: true },
          { label: "Document Upload Section", name: "documents", fileUpload: true, multiple: true }
        ].map(({ label, name, textarea, fileUpload }) => (
        <div key={name}>
          <label className="block font-medium mb-1">{label}</label>
          {fileUpload ? (
            <>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              />

              {isEdit && fileList.length > 0 && (
                <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                  {fileList.map((file, index) => (
                    <li key={file.fileId || file.name || index} className="flex justify-between items-center">
                      {file.fileId ? (
                        <a
                          href={`https://proposal-form-backend.vercel.app/api/proposals/file/${file.fileId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {file.filename}
                        </a>
                      ) : (
                        <span>{file.name || file.filename}</span>
                      )}

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

            </>
          ) : textarea ? (
            <textarea
              {...register(name, { required: 'This field is required' })}
              className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              rows={4}
              placeholder="Content"
            />
          ) : (
            <input
              {...register(name, { required: 'This field is required' })}
              className="w-full border border-gray-300 bg-gray-100 p-3 rounded"
              placeholder="Content"
            />
          )}
          {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name].message}</p>}
        </div>
      ))}

      <div className="flex flex-row gap-4 mt-6">
        <button className="bg-red-700 px-3 sm:px-6 py-2 rounded-lg text-[16px] text-[#FFFFFF] font-regular"
          onClick={() => navigate("/")}
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