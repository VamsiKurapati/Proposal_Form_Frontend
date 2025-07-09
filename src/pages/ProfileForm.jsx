import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Reusable input component
const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  id,
  ...props
}) => (
  <div className="mb-2">
    <label htmlFor={id} className="text-[18px] md:text-[24px] font-medium text-[#111827]">
      {label} {required && "*"}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${error ? "border-red-500" : ""}`}
      {...props}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

const CreateProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  // const role = state?.role;
  const role = "company";
  const signupData = state?.signupData;

  const [form, setForm] = useState({
    companyName: signupData?.organization || "",
    industry: "",
    location: "",
    website: "",
    email: signupData?.email || "",
    phone: signupData?.mobile || "",
    linkedIn: "",
    bio: "",
    fullName: signupData?.fullName || "",
    jobTitle: "",
    numberOfEmployees: "",
    services: "",
    departments: "",
    teamSize: "",
    establishedYear: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper to check valid URL
  function isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (!role) navigate("/sign_up");
  }, [role, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (role === "company") {
      if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!form.industry.trim()) newErrors.industry = "Industry is required";
      if (!form.numberOfEmployees || isNaN(form.numberOfEmployees) || Number(form.numberOfEmployees) <= 0) newErrors.numberOfEmployees = "Valid number of employees is required";
      if (!form.bio.trim()) newErrors.bio = "Bio is required";
      if (!form.website.trim()) newErrors.website = "Website is required";
      else if (!isValidUrl(form.website)) newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!form.linkedIn.trim()) newErrors.linkedIn = "LinkedIn is required";
      else if (!isValidUrl(form.linkedIn)) newErrors.linkedIn = "Please enter a valid URL (e.g., https://linkedin.com/in/username)";
      if (!form.location.trim()) newErrors.location = "Location is required";
      if (!form.establishedYear.trim() || isNaN(form.establishedYear) || form.establishedYear.length !== 4) newErrors.establishedYear = "Valid established year is required (YYYY)";
      if (!form.services.trim()) newErrors.services = "Services are required";
      // if (!form.departments.trim()) newErrors.departments = "Departments are required";
      // if (!form.teamSize || isNaN(form.teamSize) || Number(form.teamSize) <= 0) newErrors.teamSize = "Valid team size is required";
    } else {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!form.location.trim()) newErrors.location = "Location is required";
      if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!form.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      if (!form.linkedIn.trim()) newErrors.linkedIn = "LinkedIn is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("email", signupData?.email || form.email);
      formData.append("password", signupData?.password || "");
      formData.append("fullName", signupData?.fullName || form.fullName);
      formData.append("phone", signupData?.mobile || form.phone);

      if (role === "company") {
        formData.append("companyName", form.companyName);
        formData.append("industry", form.industry);
        formData.append("numberOfEmployees", form.numberOfEmployees);
        // formData.append("services", form.services);
        // formData.append("departments", form.departments);
        // formData.append("teamSize", form.teamSize);
        formData.append("bio", form.bio);
        formData.append("website", form.website);
        formData.append("linkedIn", form.linkedIn);
        formData.append("location", form.location);
        formData.append("establishedYear", form.establishedYear);
      } else {
        formData.append("companyName", form.companyName);
        formData.append("location", form.location);
        formData.append("jobTitle", form.jobTitle);
        formData.append("linkedIn", form.linkedIn);
      }

      const res = await axios.post("https://proposal-form-backend.vercel.app/api/auth/signup", formData);

      if (res.status === 201) {
        alert("Profile created successfully");
        setForm({
          companyName: "",
          industry: "",
          location: "",
          website: "",
          email: "",
          phone: "",
          linkedIn: "",
          bio: "",
          fullName: "",
          jobTitle: "",
          numberOfEmployees: "",
          services: "",
          departments: "",
          teamSize: "",
          establishedYear: "",
        });
        setErrors({});
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
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
          <div className="col-span-2">
            <FormInput
              id="companyName"
              label="Company Name"
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
              error={errors.companyName}
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="industry"
              label="Industry/Domain"
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
              error={errors.industry}
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="location"
              label="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              error={errors.location}
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              error={errors.phone}
              required
              pattern="[0-9]{10,15}"
              maxLength={15}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="establishedYear"
              label="Established Year"
              type="number"
              value={form.establishedYear}
              onChange={e => setForm({ ...form, establishedYear: e.target.value })}
              error={errors.establishedYear}
              required
              min={1800}
              max={new Date().getFullYear()}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="numberOfEmployees"
              label="Total no.of Employees"
              type="number"
              value={form.numberOfEmployees}
              onChange={e => setForm({ ...form, numberOfEmployees: e.target.value })}
              error={errors.numberOfEmployees}
              required
              min={1}
            />
          </div>
          <div className="col-span-2">
            <div className="mb-2">
              <label htmlFor="bio" className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                Bio *
              </label>
              <textarea
                id="bio"
                className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${errors.bio ? "border-red-500" : ""}`}
                rows={4}
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                required
              />
              {errors.bio && <div className="text-red-500 text-sm mt-1">{errors.bio}</div>}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="website"
              label="Website"
              type="url"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              error={errors.website}
              required
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              id="linkedIn"
              label="LinkedIn"
              type="url"
              value={form.linkedIn}
              onChange={e => setForm({ ...form, linkedIn: e.target.value })}
              error={errors.linkedIn}
              required
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
        </div>
      )}

      {role === "employee" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "fullName", label: "Full Name", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "companyName", label: "Company Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "jobTitle", label: "Job Title", type: "text" },
            { key: "phone", label: "Phone", type: "tel", pattern: "[0-9]{10,15}", maxLength: 15 },
            { key: "linkedIn", label: "LinkedIn", type: "url", pattern: "https?://.+", title: "Please enter a valid URL starting with http:// or https://" },
          ].map(field => (
            <FormInput
              key={field.key}
              id={field.key}
              label={field.label}
              type={field.type}
              value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              error={errors[field.key]}
              required
              {...(field.pattern ? { pattern: field.pattern } : {})}
              {...(field.maxLength ? { maxLength: field.maxLength } : {})}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 rounded bg-gray-200" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
        <button
          className={`px-4 py-2 rounded bg-blue-600 text-white ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create profile"}
        </button>
      </div>
    </div>
  );
};

export default CreateProfile;
