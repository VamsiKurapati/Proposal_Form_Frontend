// src/components/ProposalForm.jsx
import { useForm } from 'react-hook-form';

const ProposalForm = ({ onSubmit, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {[
        { label: "Company Details", name: "companyDetails" },
        { label: "Industry/Domain", name: "industry" },
        { label: "Company Description", name: "description", textarea: true },
        { label: "Mission/Vision Statement", name: "mission", textarea: true },
        { label: "Team Members & their Roles", name: "team" },
        { label: "Relevant experience and certifications", name: "experience", textarea: true },
        { label: "Unique qualifications and team structure", name: "qualifications", textarea: true },
        { label: "Projects/Case Studies", name: "projects", textarea: true }
      ].map(({ label, name, textarea }) => (
        <div key={name}>
          <label className="block font-medium mb-1">{label}</label>
          {textarea ? (
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
          {errors[name] && (
            <p className="text-red-600 text-sm mt-1">{errors[name].message}</p>
          )}
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
