import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBack, MdOutlineSave, MdOutlineCancel, MdOutlineBusinessCenter, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineDescription } from "react-icons/md";

const CompanyProfileUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const companyData = location.state?.companyData;

    const [form, setForm] = useState({
        companyName: companyData?.companyName || "",
        industry: companyData?.industry || "",
        location: companyData?.location || "",
        email: companyData?.email || "",
        phone: companyData?.phone || "",
        website: companyData?.website || "",
        bio: companyData?.profile?.bio || "",
        services: companyData?.profile?.services || [""],
        totalEmployees: companyData?.companyDetails?.["No.of employees"]?.value || "",
        teamSize: companyData?.companyDetails?.["Team Size"]?.value || "",
        departments: companyData?.companyDetails?.["Department"]?.value || "",
        founded: companyData?.companyDetails?.["Founded"]?.value || "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!form.industry.trim()) newErrors.industry = "Industry is required";
        if (!form.location.trim()) newErrors.location = "Location is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.bio.trim()) newErrors.bio = "Company bio is required";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (form.phone && !phoneRegex.test(form.phone.replace(/[\s\-\(\)]/g, ""))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        // Website validation (optional but if provided, should be valid)
        if (form.website && !form.website.startsWith('http')) {
            newErrors.website = "Website should start with http:// or https://";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Here you would typically make an API call to update the profile
            console.log('Updating company profile:', form);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert("Profile updated successfully!");
            navigate("/company_profile_dashboard");
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/company_profile_dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <MdOutlineArrowBack className="w-5 h-5" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">Edit Company Profile</h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <MdOutlineSave className="w-4 h-4" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <MdOutlineBusinessCenter className="w-6 h-6 text-[#2563EB]" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter company name"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry *
                                </label>
                                <input
                                    type="text"
                                    value={form.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.industry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Technology Solutions & Consulting"
                                />
                                {errors.industry && (
                                    <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., San Francisco, CA"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="contact@company.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1-555-123-4567"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.website ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="https://www.company.com"
                                />
                                {errors.website && (
                                    <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Company Description */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <MdOutlineDescription className="w-6 h-6 text-[#2563EB]" />
                            Company Description
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Bio *
                            </label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.bio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Describe your company, its mission, and what makes it unique..."
                            />
                            {errors.bio && (
                                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Services Offered
                            </label>
                            <div className="space-y-3">
                                {form.services.map((service, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => handleServiceChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                            placeholder={`Service ${index + 1}`}
                                        />
                                        {form.services.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium"
                                    >
                                        + Add Service
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Company Statistics */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Statistics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Employees
                                </label>
                                <input
                                    type="number"
                                    value={form.totalEmployees}
                                    onChange={(e) => handleInputChange('totalEmployees', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="156"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Size
                                </label>
                                <input
                                    type="number"
                                    value={form.teamSize}
                                    onChange={(e) => handleInputChange('teamSize', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="10"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departments
                                </label>
                                <input
                                    type="number"
                                    value={form.departments}
                                    onChange={(e) => handleInputChange('departments', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="16"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Founded Year
                                </label>
                                <input
                                    type="number"
                                    value={form.founded}
                                    onChange={(e) => handleInputChange('founded', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="2000"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfileUpdate; 