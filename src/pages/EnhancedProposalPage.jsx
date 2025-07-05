import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBack, MdOutlineSave, MdOutlineAdd, MdOutlineRemove, MdOutlineDescription, MdOutlineBusinessCenter, MdOutlineAttachMoney, MdOutlineSchedule, MdOutlinePerson, MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from "react-icons/md";

const EnhancedProposalPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData;

    const [form, setForm] = useState({
        // Basic Information
        title: editData?.title || "",
        clientName: editData?.clientName || "",
        clientEmail: editData?.clientEmail || "",
        clientPhone: editData?.clientPhone || "",
        clientAddress: editData?.clientAddress || "",

        // Project Details
        projectDescription: editData?.projectDescription || "",
        objectives: editData?.objectives || "",
        deliverables: editData?.deliverables || [""],
        timeline: editData?.timeline || "",
        startDate: editData?.startDate || "",
        endDate: editData?.endDate || "",

        // Financial Information
        budget: editData?.budget || "",
        paymentTerms: editData?.paymentTerms || "",
        currency: editData?.currency || "USD",

        // Technical Requirements
        technicalRequirements: editData?.technicalRequirements || [""],
        technologies: editData?.technologies || [""],

        // Team Information
        teamMembers: editData?.teamMembers || [""],
        projectManager: editData?.projectManager || "",

        // Additional Information
        assumptions: editData?.assumptions || [""],
        risks: editData?.risks || [""],
        successMetrics: editData?.successMetrics || [""],
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");

    const sections = [
        { id: "basic", title: "Basic Information", icon: <MdOutlineBusinessCenter /> },
        { id: "project", title: "Project Details", icon: <MdOutlineDescription /> },
        { id: "financial", title: "Financial", icon: <MdOutlineAttachMoney /> },
        { id: "technical", title: "Technical", icon: <MdOutlineDescription /> },
        { id: "team", title: "Team", icon: <MdOutlinePerson /> },
        { id: "additional", title: "Additional", icon: <MdOutlineDescription /> },
    ];

    const handleInputChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...form[field]];
        newArray[index] = value;
        setForm(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayItem = (field, index) => {
        if (form[field].length > 1) {
            const newArray = form[field].filter((_, i) => i !== index);
            setForm(prev => ({ ...prev, [field]: newArray }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic validation
        if (!form.title.trim()) newErrors.title = "Proposal title is required";
        if (!form.clientName.trim()) newErrors.clientName = "Client name is required";
        if (!form.clientEmail.trim()) newErrors.clientEmail = "Client email is required";
        if (!form.projectDescription.trim()) newErrors.projectDescription = "Project description is required";
        if (!form.objectives.trim()) newErrors.objectives = "Project objectives are required";
        if (!form.budget.trim()) newErrors.budget = "Budget is required";
        if (!form.timeline.trim()) newErrors.timeline = "Timeline is required";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.clientEmail && !emailRegex.test(form.clientEmail)) {
            newErrors.clientEmail = "Please enter a valid email address";
        }

        // Date validation
        if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
            newErrors.endDate = "End date must be after start date";
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
            // Here you would typically make an API call to create/update the proposal
            console.log('Submitting proposal:', form);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(editData ? "Proposal updated successfully!" : "Proposal created successfully!");
            navigate("/company_profile_dashboard");
        } catch (error) {
            alert("Failed to submit proposal: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            console.log('Saving draft:', form);
            alert("Draft saved successfully!");
        } catch (error) {
            alert("Failed to save draft: " + error.message);
        }
    };

    const renderBasicSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposal Title *
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter proposal title"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name *
                    </label>
                    <input
                        type="text"
                        value={form.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.clientName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter client name"
                    />
                    {errors.clientName && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Email *
                    </label>
                    <input
                        type="email"
                        value={form.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="client@company.com"
                    />
                    {errors.clientEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Phone
                    </label>
                    <input
                        type="tel"
                        value={form.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        placeholder="+1-555-123-4567"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Address
                </label>
                <textarea
                    value={form.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter client address"
                />
            </div>
        </div>
    );

    const renderProjectSection = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                </label>
                <textarea
                    value={form.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.projectDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Describe the project in detail..."
                />
                {errors.projectDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Objectives *
                </label>
                <textarea
                    value={form.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.objectives ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="What are the main objectives of this project?"
                />
                {errors.objectives && (
                    <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deliverables
                </label>
                <div className="space-y-3">
                    {form.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={deliverable}
                                onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Deliverable ${index + 1}`}
                            />
                            {form.deliverables.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('deliverables', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('deliverables')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Deliverable
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline *
                    </label>
                    <input
                        type="text"
                        value={form.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.timeline ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., 3 months"
                    />
                    {errors.timeline && (
                        <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderFinancialSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget *
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={form.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                        </select>
                        <input
                            type="number"
                            value={form.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.budget ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter budget amount"
                            min="0"
                        />
                    </div>
                    {errors.budget && (
                        <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Terms
                    </label>
                    <input
                        type="text"
                        value={form.paymentTerms}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        placeholder="e.g., 50% upfront, 50% on completion"
                    />
                </div>
            </div>
        </div>
    );

    const renderTechnicalSection = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Requirements
                </label>
                <div className="space-y-3">
                    {form.technicalRequirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={req}
                                onChange={(e) => handleArrayChange('technicalRequirements', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Technical requirement ${index + 1}`}
                            />
                            {form.technicalRequirements.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('technicalRequirements', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('technicalRequirements')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Requirement
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies
                </label>
                <div className="space-y-3">
                    {form.technologies.map((tech, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={tech}
                                onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Technology ${index + 1}`}
                            />
                            {form.technologies.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('technologies', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('technologies')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Technology
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTeamSection = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Manager
                </label>
                <input
                    type="text"
                    value={form.projectManager}
                    onChange={(e) => handleInputChange('projectManager', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter project manager name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members
                </label>
                <div className="space-y-3">
                    {form.teamMembers.map((member, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={member}
                                onChange={(e) => handleArrayChange('teamMembers', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Team member ${index + 1}`}
                            />
                            {form.teamMembers.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('teamMembers', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('teamMembers')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Team Member
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAdditionalSection = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assumptions
                </label>
                <div className="space-y-3">
                    {form.assumptions.map((assumption, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={assumption}
                                onChange={(e) => handleArrayChange('assumptions', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Assumption ${index + 1}`}
                            />
                            {form.assumptions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('assumptions', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('assumptions')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Assumption
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risks
                </label>
                <div className="space-y-3">
                    {form.risks.map((risk, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={risk}
                                onChange={(e) => handleArrayChange('risks', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Risk ${index + 1}`}
                            />
                            {form.risks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('risks', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('risks')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Risk
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Metrics
                </label>
                <div className="space-y-3">
                    {form.successMetrics.map((metric, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={metric}
                                onChange={(e) => handleArrayChange('successMetrics', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder={`Success metric ${index + 1}`}
                            />
                            {form.successMetrics.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('successMetrics', index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <MdOutlineRemove className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('successMetrics')}
                        className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium flex items-center gap-1"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Success Metric
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSectionContent = () => {
        switch (activeSection) {
            case "basic":
                return renderBasicSection();
            case "project":
                return renderProjectSection();
            case "financial":
                return renderFinancialSection();
            case "technical":
                return renderTechnicalSection();
            case "team":
                return renderTeamSection();
            case "additional":
                return renderAdditionalSection();
            default:
                return renderBasicSection();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/company_profile_dashboard")}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <MdOutlineArrowBack className="w-5 h-5" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {editData ? "Edit Proposal" : "Create New Proposal"}
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <MdOutlineSave className="w-4 h-4" />
                                {isSubmitting ? "Submitting..." : (editData ? "Update Proposal" : "Submit Proposal")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {section.icon}
                            {section.title}
                        </button>
                    ))}
                </div>
                <div className="mt-8">
                    {renderSectionContent()}
                </div>
            </div>
        </div>
    );
};

export default EnhancedProposalPage; 