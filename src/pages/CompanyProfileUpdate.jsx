import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineArrowBack, MdOutlineSave, MdOutlineCancel, MdOutlineBusinessCenter, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineDescription, MdOutlineGroup, MdOutlineGraphicEq, MdOutlineDomain, MdOutlineCalendarToday } from "react-icons/md";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useProfile } from "../context/ProfileContext";

const INDUSTRY_OPTIONS = [
    "Information Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Consulting",
    "Marketing",
    "Legal",
    "Real Estate",
    "Transportation",
    "Hospitality",
    "Other",
];

const EMPLOYEE_OPTIONS = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10000+",
];

const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1950; y--) {
        years.push(y.toString());
    }
    return years;
};

// Reusable input component
const FormInput = ({
    label,
    type = "text",
    value,
    onChange,
    error,
    required = false,
    id,
    disabled = false,
    placeholder,
    ...props
}) => (
    <div className="mb-4">
        <label htmlFor={id} className="text-[18px] md:text-[24px] font-medium text-[#111827]">
            {label} {required && "*"}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${error ? "border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            {...props}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

// Phone input component
const PhoneInputField = ({
    value,
    onChange,
    error,
    disabled = false
}) => (
    <div className="mb-4">
        <label htmlFor="phone" className="text-[18px] md:text-[24px] font-medium text-[#111827]">
            Phone *
        </label>
        <PhoneInput
            country={'in'}
            value={value}
            onChange={onChange}
            disabled={disabled}
            inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
                placeholder: "Enter your mobile number",
                disabled: disabled
            }}
            inputStyle={{
                width: "100%",
                paddingLeft: "56px",
                height: "40px",
                backgroundColor: "#D9D9D966",
                fontSize: "20px",
                color: "#000000",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "text",
                boxSizing: "border-box"
            }}
            containerStyle={{
                width: "100%",
            }}
            dropdownStyle={{
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 99999
            }}
            buttonStyle={{
                height: "40px",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                boxSizing: "border-box"
            }}
            containerClass="w-full md:w-[436px] mt-1"
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const CompanyProfileUpdate = () => {
    const navigate = useNavigate();
    const { companyData, loading, error, refreshProfile } = useProfile();

    const [form, setForm] = useState({
        companyName: companyData?.companyName || "",
        industry: companyData?.industry || "",
        location: companyData?.location || "",
        email: companyData?.email || "",
        phone: companyData?.phone || "",
        website: companyData?.website || "",
        linkedIn: companyData?.linkedIn || "",
        bio: companyData?.profile?.bio || "",
        services: companyData?.profile?.services || [""],
        numberOfEmployees: companyData?.companyDetails?.["No.of employees"]?.value || "",
        founded: companyData?.companyDetails?.["Founded"]?.value || "",
    });

    const [errors, setErrors] = useState({});
    // const [loading, setLoading] = useState(false); // This line is removed

    // Helper to check valid URL
    function isValidUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    }

    const handleInputChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleServiceChange = (index, value) => {
        const newServices = [...form.services];
        newServices[index] = value;
        setForm(prev => ({ ...prev, services: newServices }));
    };

    const addService = () => {
        if (form.services.length < 10) {
            setForm(prev => ({ ...prev, services: [...prev.services, ""] }));
        }
    };

    const removeService = (index) => {
        if (form.services.length > 1) {
            const newServices = form.services.filter((_, i) => i !== index);
            setForm(prev => ({ ...prev, services: newServices }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneNumber = parsePhoneNumberFromString(form.phone.startsWith('+') ? form.phone : `+${form.phone}`);

        if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!form.industry.trim()) newErrors.industry = "Industry is required";
        if (!form.location.trim()) newErrors.location = "Location is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!phoneNumber || !phoneNumber.isValid()) newErrors.phone = "Enter a valid phone number (7-15 digits, numbers only)";
        if (!form.linkedIn.trim()) newErrors.linkedIn = "LinkedIn is required";
        else if (!isValidUrl(form.linkedIn)) newErrors.linkedIn = "Please enter a valid URL (e.g., https://linkedin.com/username)";
        if (!form.bio.trim()) newErrors.bio = "Company bio is required";
        else if (form.bio.length < 100) newErrors.bio = "Bio must be at least 100 characters long";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Website validation (optional but if provided, should be valid)
        if (form.website && !isValidUrl(form.website)) {
            newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // setLoading(true); // This line is removed
        try {
            const formData = new FormData();
            formData.append("companyName", form.companyName);
            formData.append("industry", form.industry);
            formData.append("location", form.location);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("website", form.website);
            formData.append("linkedIn", form.linkedIn);
            formData.append("bio", form.bio);
            const filteredServices = form.services.filter(service => service.trim());
            formData.append("services", JSON.stringify(filteredServices));
            formData.append("numberOfEmployees", form.numberOfEmployees);
            formData.append("founded", form.founded);

            const response = await axios.put("https://proposal-form-backend.vercel.app/api/profile/updateCompanyProfile", formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.status === 200) {
                alert("Profile updated successfully!");
                navigate("/company_profile_dashboard");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update profile: " + (error.response?.data?.message || error.message));
        } finally {
            // setLoading(false); // This line is removed
        }
    };

    const handleCancel = () => {
        navigate("/company_profile_dashboard");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-center w-full mx-auto gap-4">
                            {/* <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
                            >
                                <MdOutlineArrowBack className="w-5 h-5" />
                                Back to Dashboard
                            </button> */}
                            <h1 className="text-2xl font-semibold text-[#111827]">Edit Company Profile</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                        <h2 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">
                            <MdOutlineBusinessCenter className="w-6 h-6 text-[#2563EB]" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            <div className="col-span-2 md:col-span-1">
                                <FormInput
                                    id="companyName"
                                    label="Company Name"
                                    value={form.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    error={errors.companyName}
                                    required
                                    disabled={loading}
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="industry" className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                                    Industry *
                                </label>
                                <select
                                    id="industry"
                                    value={form.industry}
                                    onChange={e => handleInputChange('industry', e.target.value)}
                                    disabled={loading}
                                    className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${errors.industry ? "border-red-500" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    required
                                >
                                    <option value="">Select Industry</option>
                                    {INDUSTRY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {errors.industry && <div className="text-red-500 text-sm mt-1">{errors.industry}</div>}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <FormInput
                                    id="location"
                                    label="Location"
                                    value={form.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    error={errors.location}
                                    required
                                    disabled={loading}
                                    placeholder="e.g., San Francisco, CA"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <FormInput
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={errors.email}
                                    required
                                    disabled={loading}
                                    placeholder="contact@company.com"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <PhoneInputField
                                    value={form.phone}
                                    onChange={phone => handleInputChange('phone', phone)}
                                    error={errors.phone}
                                    disabled={loading}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <FormInput
                                    id="website"
                                    label="Website"
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    error={errors.website}
                                    disabled={loading}
                                    placeholder="https://www.company.com"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <FormInput
                                    id="linkedIn"
                                    label="LinkedIn"
                                    type="url"
                                    value={form.linkedIn}
                                    onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                                    error={errors.linkedIn}
                                    required
                                    disabled={loading}
                                    placeholder="https://linkedin.com/company/yourcompany"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Description */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                        <h2 className="text-xl font-semibold text-[#111827] mb-6 flex items-center gap-2">
                            <MdOutlineDescription className="w-6 h-6 text-[#2563EB]" />
                            Company Description
                        </h2>

                        <div className="mb-6">
                            <label htmlFor="bio" className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                                Company Bio *
                            </label>
                            <textarea
                                id="bio"
                                value={form.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={4}
                                disabled={loading}
                                className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${errors.bio ? "border-red-500" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                placeholder="Describe your company, its mission, and what makes it unique..."
                            />
                            {errors.bio && <div className="text-red-500 text-sm mt-1">{errors.bio}</div>}
                        </div>

                        <div>
                            <label className="text-[18px] md:text-[24px] font-medium text-[#111827] mb-2 block">
                                Services Offered
                            </label>
                            <div className="space-y-3">
                                {form.services.map((service, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => handleServiceChange(index, e.target.value)}
                                            disabled={loading}
                                            className={`flex-1 border rounded-md p-2 bg-[#F0F0F0] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                            placeholder={`Service ${index + 1}`}
                                        />
                                        {form.services.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                disabled={loading}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {form.services.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={addService}
                                        disabled={loading}
                                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        + Add Service
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Company Statistics */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                        <h2 className="text-xl font-semibold text-[#111827] mb-6">Company Statistics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="numberOfEmployees" className="text-[18px] md:text-[24px] font-medium text-[#111827] mb-2 block">
                                    Total Employees
                                </label>
                                <div className="flex items-center gap-2">
                                    <MdOutlineGroup className="w-6 h-6 text-[#2563EB]" />
                                    <select
                                        id="numberOfEmployees"
                                        value={form.numberOfEmployees}
                                        onChange={e => handleInputChange('numberOfEmployees', e.target.value)}
                                        disabled={loading}
                                        className={`w-full border rounded-md p-2 bg-[#F0F0F0] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <option value="">Select Range</option>
                                        {EMPLOYEE_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="founded" className="text-[18px] md:text-[24px] font-medium text-[#111827] mb-2 block">
                                    Founded Year
                                </label>
                                <div className="flex items-center gap-2">
                                    <MdOutlineCalendarToday className="w-6 h-6 text-[#2563EB]" />
                                    <select
                                        id="founded"
                                        value={form.founded}
                                        onChange={e => handleInputChange('founded', e.target.value)}
                                        disabled={loading}
                                        className={`w-full border rounded-md p-2 bg-[#F0F0F0] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <option value="">Select Year</option>
                                        {getYearOptions().map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex gap-3 justify-center items-center w-full mx-auto pb-8">
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <MdOutlineSave className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default CompanyProfileUpdate; 