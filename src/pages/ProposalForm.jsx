// src/components/ProposalForm.jsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

const ProposalForm = ({ onSubmit: handleFormSubmit, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues });

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (defaultValues?.projectFiles) {
      setFileList(defaultValues.projectFiles);
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
        { label: "Company Details", name: "companyDetails" },
        { label: "Industry/Domain", name: "industry" },
        { label: "Company Description", name: "description", textarea: true },
        { label: "Mission/Vision Statement", name: "mission", textarea: true },
        { label: "Team Members & their Roles", name: "team" },
        { label: "Team experience", name: "experience", textarea: true },
        { label: "Certifications and Awards", name: "certifications", textarea: true },
        { label: "Unique qualifications and team structure", name: "qualifications", textarea: true },
        { label: "Past Projects/Case Studies", name: "projects", fileUpload: true, multiple: true }
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
              {fileList.length > 0 && (
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                  {fileList.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      {file.name || file.filename}
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {isEdit ? 'Update Proposal' : 'Submit Proposal'}
      </button>
    </form>
  );
};

export default ProposalForm;