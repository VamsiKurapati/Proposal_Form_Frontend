import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { TbTrashX } from "react-icons/tb";
import NavbarComponent from "./NavbarComponent";
import axios from "axios";

const categories = [
    "Billing & Payments",
    "Proposal Issues",
    "Account & Access",
    "Technical Errors",
    "Feature Requests",
    "Others",
];

const subCategoriesMap = {
    "Billing & Payments": [
        "Payment Failure",
        "Refund Request",
        "Invoice Issue",
        "Pricing Inquiry",
        "Subscription Cancellation",
        "Failed Transaction",
    ],
    "Proposal Issues": ["Proposal Formatting", "Template Issues"],
    "Account & Access": [
        "Password Reset",
        "Account Deletion",
        "Profile Update",
        "Account Recovery",
    ],
    "Technical Errors": [
        "Edit Option-profile edit",
        "Page Loading Issue",
        "Form Submission Error",
        "Broken Link",
        "Performance Issues",
        "Browser Compatibility",
        "File Upload/Download Problems",
    ],
    "Feature Requests": [
        "Upload/Export issue",
        "Unable to use Feature according to the subscribed plan",
        "UI/UX Improvements",
    ],
    Others: ["General Inquiry", "Request Documentation", "Training Request"],
};

const BASE_URL = "https://proposal-form-backend.vercel.app";

const statusSteps = ["Created", "In Progress", "Completed"];

const SupportTicket = () => {
    const { role, userId } = useUser();

    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [description, setDescription] = useState("");
    const [attachments, setAttachments] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    const [tickets, setTickets] = useState([]);
    const [openTickets, setOpenTickets] = useState({});
    const [showConversationPopup, setShowConversationPopup] = useState(null);

    const [conversationMessages, setConversationMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Helper function to update a specific ticket locally
    const updateTicketLocally = (ticketId, updates) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId || ticket.id === ticketId
                    ? { ...ticket, ...updates }
                    : ticket
            )
        );
    };

    // Helper function to add a new ticket locally
    const addTicketLocally = (newTicket) => {
        setTickets(prevTickets => [newTicket, ...prevTickets]);
    };

    // Helper function to remove a ticket locally
    const removeTicketLocally = (ticketId) => {
        setTickets(prevTickets =>
            prevTickets.filter(ticket =>
                ticket._id !== ticketId && ticket.id !== ticketId
            )
        );
    };

    // Helper function to update conversation messages locally
    const addMessageLocally = (ticketId, message) => {
        if (showConversationPopup === ticketId) {
            setConversationMessages(prev => [...prev, message]);
        }
    };

    // Function to check for admin responses and update tickets locally
    const checkForAdminUpdates = async () => {
        if (!userId) return;

        setRefreshing(true);
        try {
            const { data } = await axios.get(
                `${BASE_URL}/api/support/tickets?userId=${userId}`
            );

            if (data?.tickets) {
                // Check if there are any updates
                const hasUpdates = data.tickets.some(newTicket => {
                    const oldTicket = tickets.find(t =>
                        t._id === newTicket._id || t.id === newTicket.id
                    );
                    return !oldTicket ||
                        oldTicket.status !== newTicket.status ||
                        oldTicket.Resolved_Description !== newTicket.Resolved_Description;
                });

                if (hasUpdates) {
                    // Update tickets that have changed
                    setTickets(prevTickets => {
                        const updatedTickets = prevTickets.map(prevTicket => {
                            const newTicket = data.tickets.find(t =>
                                t._id === prevTicket._id || t.id === prevTicket.id
                            );
                            return newTicket || prevTicket;
                        });
                        return updatedTickets;
                    });

                    // Show success message
                    setSuccessMsg("Tickets updated successfully!");
                    setTimeout(() => setSuccessMsg(""), 3000);
                } else {
                    setSuccessMsg("No updates found");
                    setTimeout(() => setSuccessMsg(""), 2000);
                }
            }
        } catch (error) {
            console.error("Error checking for admin updates:", error);
            setErrorMsg("Failed to check for updates");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setRefreshing(false);
        }
    };

    // Function to handle admin message updates
    const handleAdminMessageUpdate = (ticketId, adminMessage) => {
        // Update conversation if the popup is open for this ticket
        if (showConversationPopup === ticketId) {
            const newMsg = {
                text: adminMessage.message,
                createdAt: adminMessage.createdAt,
                sender: "admin"
            };
            addMessageLocally(ticketId, newMsg);
        }

        // Update ticket status if it changed
        if (adminMessage.status) {
            updateTicketLocally(ticketId, { status: adminMessage.status });
        }
    };

    const fetchConversationMessages = async (ticketId) => {
        setLoadingMessages(true);
        try {
            const [userRes, adminRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/support/tickets/${ticketId}/userMessages`),
                axios.get(`${BASE_URL}/api/support/tickets/${ticketId}/adminMessages`)
            ]);

            const userMsgs = (userRes.data.userMessages || []).map(msg => ({
                text: msg.message,
                createdAt: msg.createdAt,
                sender: "user"
            }));

            const adminMsgs = (adminRes.data.adminMessages || []).map(msg => ({
                text: msg.message,
                createdAt: msg.createdAt,
                sender: "admin"
            }));

            // ✅ Merge & sort by createdAt
            const allMsgs = [...userMsgs, ...adminMsgs].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            setConversationMessages(allMsgs);
        } catch (err) {
            console.error("Fetch conversation error:", err);
            setConversationMessages([]);
        }
        setLoadingMessages(false);
    };



    useEffect(() => {
        if (showConversationPopup) {
            fetchConversationMessages(showConversationPopup);
        }
    }, [showConversationPopup]);

    // Fetch tickets from backend
    useEffect(() => {
        if (!userId) return;

        const fetchTickets = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `${BASE_URL}/api/support/tickets?userId=${userId}`
                );

                if (data?.tickets?.length) {
                    setTickets(data.tickets);
                } else {
                    setTickets([]);
                }
            } catch (error) {
                console.error(
                    "❌ Error fetching tickets:",
                    error.response?.data || error.message
                );
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [userId]);

    // Periodically check for admin updates
    useEffect(() => {
        if (!userId) return;

        const interval = setInterval(checkForAdminUpdates, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [userId]);

    // Pre-open dropdowns for "Created" and "In Progress"
    useEffect(() => {
        const initialOpen = {};
        tickets.forEach((ticket) => {
            if (
                ticket.status === "Created" ||
                ticket.status === "In Progress" ||
                ticket.status === "Re-Opened"
            ) {
                initialOpen[ticket._id] = true;
            }
        });
        setOpenTickets(initialOpen);
    }, [tickets]);

    const toggleDropdown = (ticketId) => {
        setOpenTickets((prev) => ({
            ...prev,
            [ticketId]: !prev[ticketId],
        }));
    };

    const handleFileChange = (e) => {
        setAttachments(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setErrorMsg("User ID not found. Please log in again.");
            return;
        }

        setSubmitting(true);
        setSuccessMsg("");
        setErrorMsg("");

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("description", description);
        if (attachments) formData.append("attachments", attachments);

        try {
            const res = await axios.post(
                `${BASE_URL}/api/support/tickets`,
                formData
            );

            if (res.status === 200) {
                // Add the new ticket locally immediately
                const newTicket = res.data.ticket || res.data;
                if (newTicket) {
                    addTicketLocally(newTicket);

                    // Open dropdown for the new ticket
                    setOpenTickets(prev => ({
                        ...prev,
                        [newTicket._id || newTicket.id]: true
                    }));
                }

                // Clear form
                setCategory("");
                setSubCategory("");
                setDescription("");
                setAttachments(null);

                const fileInput = document.getElementById("fileUpload");
                if (fileInput) fileInput.value = "";

                setSuccessMsg("Support ticket submitted successfully!");
                setTimeout(() => setSuccessMsg(""), 3000);
            } else {
                setErrorMsg(res.data.message || "Failed to submit ticket.");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "An error occurred.");
        }
        setSubmitting(false);
    };

    const getStepStatusDynamic = (currentStatus, step, steps) => {
        const currentIndex = steps.indexOf(currentStatus);
        const stepIndex = steps.indexOf(step);
        if (stepIndex < currentIndex) return "done";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <div>
            <NavbarComponent />
            <div className="max-w-4xl mx-auto mt-20">
                {/* Form */}
                <div className="bg-white p-8 rounded-lg">
                    <h2 className="text-2xl text-blue-600 font-semibold mb-1">
                        Create Support Ticket
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Please provide details about your issue
                    </p>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Category */}
                            <div>
                                <label className="block font-medium mb-1">Category *</label>
                                <select
                                    className="w-full bg-gray-100 border border-2 border-blue-600 text-gray-600 text-sm rounded px-3 py-2"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setSubCategory("");
                                    }}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub-category */}
                            <div>
                                <label className="block font-medium mb-1">Sub-category *</label>
                                <select
                                    className="w-full bg-gray-100 border border-2 border-blue-600 text-gray-600 text-sm rounded px-3 py-2"
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    required
                                    disabled={!category}
                                >
                                    <option value="">Select Sub-category</option>
                                    {category &&
                                        subCategoriesMap[category]?.map((sub) => (
                                            <option key={sub} value={sub}>
                                                {sub}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block font-medium mb-1">Detailed Description *</label>
                            <textarea
                                className="w-full bg-gray-100 border border-2 border-blue-600 text-gray-600 text-sm rounded px-3 py-2"
                                placeholder="Describe your issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        {/* Attachment */}
                        <div className="mb-6">
                            <label className="block font-medium mb-1">Upload Attachments *</label>

                            <div
                                className="flex flex-col items-center justify-center border-2 border border-blue-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
                                onClick={() => document.getElementById("fileUpload").click()}
                            >
                                <p className="text-gray-600 font-medium">
                                    Drag & drop files here or click to browse
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Supported formats: PNG, JPG, PDF, DOC (Max 10MB)
                                </p>
                                <button
                                    type="button"
                                    className="mt-3 px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                                >
                                    Browse Files
                                </button>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {attachments && (
                                <div className="mt-3 text-blue-600">{attachments.name}</div>
                            )}
                        </div>

                        {/* Messages */}
                        {successMsg && (
                            <div className="mb-4 text-green-600">
                                <span className="rounded-lg p-2">{successMsg}</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setCategory("");
                                    setSubCategory("");
                                    setDescription("");
                                    setAttachments(null);
                                }}
                                className="bg-gray-100 text-black px-6 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded"
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Ticket"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ticket List */}
                <div className="p-6 bg-grey min-h-screen">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl text-blue-600 font-semibold mb-1">
                                Track Support Ticket
                            </h2>
                            <p className="text-gray-500">
                                Track the status of your support ticket
                            </p>
                        </div>
                        <button
                            onClick={checkForAdminUpdates}
                            disabled={refreshing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            title="Check for updates"
                        >
                            {refreshing ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {refreshing ? "Checking..." : "Refresh"}
                        </button>
                    </div>

                    {/* Success and Error Messages */}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {successMsg}
                        </div>
                    )}
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {errorMsg}
                        </div>
                    )}

                    {tickets.map((ticket) => {
                        return (
                            <div
                                key={ticket._id || ticket.id || Math.random()}
                                className="bg-gray-100 rounded-lg p-4 mb-4"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div className="w-full">

                                        <div className="relative w-full rounded-lg p-2">

                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                                Ticket ID: {ticket._id || ticket.id || "N/A"}
                                            </span>

                                            <span className="absolute top-2 right-[-33px] text-red-500 hover:text-red-600 font-semibold  rounded" >
                                                {ticket.status != "Completed" && <button
                                                    title="Withdraw this ticket"
                                                    className="text-red-500 hover:text-red-600 font-semibold py-2 px-2 rounded"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        try {
                                                            await axios.put(
                                                                `${BASE_URL}/api/support/tickets/${ticket._id || ticket.id
                                                                }/withdrawn`
                                                            );

                                                            // Update ticket locally immediately
                                                            updateTicketLocally(ticket._id || ticket.id, {
                                                                status: "Withdrawn"
                                                            });

                                                        } catch (err) {
                                                            alert(
                                                                err.response?.data?.message ||
                                                                "Failed to withdraw ticket."
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <TbTrashX className="text-red-500 text-2xl" />
                                                    {/* <FaTrash/> */}

                                                </button>}

                                            </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-20 text-sm">
                                            <div>
                                                <p className="text-gray-500">Sub-category/Subject:</p>
                                                <p className="text-blue-600 font-medium">
                                                    {ticket.subCategory || ticket.subject || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Category:</p>
                                                <p className="text-blue-600 font-medium">
                                                    {ticket.category || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Date:</p>
                                                <p className="text-blue-600 font-medium">
                                                    {ticket.createdAt
                                                        ? new Date(ticket.createdAt).toLocaleDateString()
                                                        : ticket.date || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex">
                                            <p className="text-gray-500">Description:</p>
                                            <p className="text-blue-600 font-medium">
                                                {ticket.description || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleDropdown(ticket._id || ticket.id)}
                                        className="text-white bg-blue-600 border-2 border-blue-600 rounded-full p-1 "
                                    >
                                        {openTickets[ticket._id || ticket.id] ? (
                                            <FaChevronUp />
                                        ) : (
                                            <FaChevronDown />
                                        )}
                                    </button>
                                </div>

                                {/* Dropdown Content */}
                                {openTickets[ticket._id || ticket.id] && (

                                    <div className="mt-6 p-4 rounded-lg">
                                        <div className="ml-20 flex justify-center items-center mb-6 relative">
                                            {(() => {
                                                let steps = ["Created"];
                                                if (
                                                    ticket.isOpen
                                                )
                                                    steps.push("Re-Opened");
                                                steps.push("In Progress");
                                                if (ticket.status == 'Withdrawn') { steps.push('Withdrawn') }
                                                else {
                                                    steps.push("Completed");
                                                }

                                                let currentStatus = ticket.isOpen && ticket.status != "Withdrawn" && ticket.status != "Completed" && ticket.status != "In Progress" ? "Re-Opened" : ticket.status;
                                                return steps.map((step, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="relative flex flex-1 items-center">
                                                            <div className="flex flex-col items-center z-10">
                                                                <div
                                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${getStepStatusDynamic(currentStatus, step, steps) === "done" ||
                                                                        getStepStatusDynamic(currentStatus, step, steps) === "current"
                                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                                        : "bg-gray-200 border-gray-300 text-gray-500"
                                                                        }`}
                                                                >
                                                                    ✓
                                                                </div>
                                                                <span
                                                                    className={`mt-2 text-sm font-medium ${getStepStatusDynamic(currentStatus, step, steps) === "current"
                                                                        ? "text-blue-500"
                                                                        : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    {step}
                                                                </span>
                                                            </div>

                                                            {index < steps.length - 1 && (
                                                                <div className="absolute top-4 left-8 w-full h-1">
                                                                    <div
                                                                        className={`h-1 ${getStepStatusDynamic(currentStatus, steps[index + 1], steps) !==
                                                                            "pending"
                                                                            ? "bg-blue-500"
                                                                            : "bg-gray-300"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </React.Fragment>

                                                )



                                                );


                                            })()}
                                        </div>

                                        {/* Admin Reply */}
                                        {/* Conversation Popup Trigger */}
                                        <div className="flex justify-center mt-4">
                                            <button
                                                className="bg-gray-200 hover:bg-blue-500 hover:text-white text-blue-600 font-semibold py-1 px-4 rounded shadow"
                                                onClick={() => setShowConversationPopup(ticket._id || ticket.id)}
                                            >
                                                View Conversation
                                            </button>
                                        </div>

                                        {/* Conversation Popup */}
                                        {showConversationPopup === (ticket._id || ticket.id) && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40  backdrop-blur-sm">
                                                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                                        onClick={() => setShowConversationPopup(null)}
                                                    >
                                                        <span className="text-2xl">&times;</span>
                                                    </button>
                                                    <div className="p-4 border-b flex items-center">
                                                        <h2 className="text-lg font-semibold text-blue-700 flex-1">Conversation</h2>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                                        {loadingMessages ? (
                                                            <div className="text-center text-gray-500">Loading messages...</div>
                                                        ) : (
                                                            <>

                                                                {/* Admin Messages */}
                                                                {[...conversationMessages]
                                                                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // oldest → newest
                                                                    .map((msg, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                                                                                }`}
                                                                        >
                                                                            <div
                                                                                className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.sender === "user"
                                                                                    ? "bg-blue-100 text-blue-800"
                                                                                    : "bg-green-100 text-green-800"
                                                                                    }`}
                                                                            >
                                                                                <span className="font-semibold">
                                                                                    {msg.sender === "user" ? "User:" : "Admin:"}
                                                                                </span>{" "}
                                                                                {msg.text}
                                                                            </div>
                                                                            <span
                                                                                className={`text-xs text-gray-400 mt-1 ${msg.sender === "user" ? "mr-1" : "ml-1"
                                                                                    }`}
                                                                            >
                                                                                {msg.createdAt
                                                                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit",
                                                                                    })
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                    ))}

                                                                {/* No messages */}
                                                                {conversationMessages.length === 0 && (
                                                                    <div className="text-center text-gray-400">No conversation yet.</div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <form
                                                        className="p-4 border-t flex gap-2"
                                                        onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            if (!newMessage.trim()) return;
                                                            setSendingMessage(true);
                                                            try {
                                                                const response = await axios.post(
                                                                    `${BASE_URL}/api/support/tickets/${ticket._id || ticket.id}/userMessages`,
                                                                    { message: newMessage }
                                                                );

                                                                // Add message locally immediately
                                                                if (response.data.userMessage) {
                                                                    const newMsg = {
                                                                        text: response.data.userMessage.message,
                                                                        createdAt: response.data.userMessage.createdAt,
                                                                        sender: "user"
                                                                    };
                                                                    addMessageLocally(ticket._id || ticket.id, newMsg);
                                                                }

                                                                setNewMessage("");
                                                            } catch (err) {
                                                                alert(
                                                                    err.response?.data?.message ||
                                                                    "Failed to send message."
                                                                );
                                                            }
                                                            setSendingMessage(false);
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="flex-1 border rounded px-3 py-2 focus:outline-none"
                                                            placeholder="Type your message..."
                                                            value={newMessage}
                                                            onChange={e => setNewMessage(e.target.value)}
                                                            disabled={sendingMessage}
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                                            disabled={sendingMessage || !newMessage.trim()}
                                                        >
                                                            {sendingMessage ? "Sending..." : "Send"}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {/* State and logic for conversation popup */}
                                        {/* Place these hooks at the top level of your component (not inside render/return): */}
                                        {/* 
                    
                    */}





                                        {/* Description */}
                                        <div className="mt-6 text-center p-4 bg-gray-100 border-2 border-blue-600 rounded-lg flex items-center">
                                            <span className="text-gray-500 mr-2">Resolved Description:</span>
                                            <span className="text-blue-600 font-medium">
                                                {ticket.Resolved_Description.length > 0 ? ticket.Resolved_Description : "Admin will contact you soon"}
                                            </span>
                                        </div>

                                        {/* Reopen Button */}
                                        {ticket.status === "Completed" ||
                                            ticket.status === "completed" || ticket.status === "Withdrawn" || ticket.status === "withdrawn" ? (
                                            <div className="w-full flex justify-center mt-8">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        try {
                                                            await axios.put(
                                                                `${BASE_URL}/api/support/tickets/${ticket._id || ticket.id
                                                                }/reopen`
                                                            );

                                                            // Update ticket locally immediately
                                                            updateTicketLocally(ticket._id || ticket.id, {
                                                                status: "Re-Opened",
                                                                isOpen: true
                                                            });

                                                            // Open the dropdown for the reopened ticket
                                                            setOpenTickets(prev => ({
                                                                ...prev,
                                                                [ticket._id || ticket.id]: true
                                                            }));

                                                        } catch (err) {
                                                            alert(
                                                                err.response?.data?.message ||
                                                                "Failed to reopen ticket."
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Reopen
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SupportTicket;