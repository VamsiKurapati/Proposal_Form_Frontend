import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FaChevronDown, FaChevronUp , FaTrash} from "react-icons/fa";
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

  // Fetch tickets from backend
  useEffect(() => {
    if (!userId) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/support/tickets?userId=${userId}`
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
        "http://localhost:5000/api/support/tickets",
        formData
      );

      if (res.status === 200) {
        setCategory("");
        setSubCategory("");
        setDescription("");
        setAttachments(null);

        const fileInput = document.getElementById("fileUpload");
        if (fileInput) fileInput.value = "";

        // Fetch updated tickets
        const updatedTickets = await axios.get(
          `http://localhost:5000/api/support/tickets?userId=${userId}`
        );

        if (updatedTickets.data?.tickets) {
          setTickets(updatedTickets.data.tickets); // ensure new array reference
          // Open dropdowns for newly added ticket(s)
          const newOpen = {};
          updatedTickets.data.tickets.forEach((ticket) => {
            if (
              ticket.status === "Created" ||
              ticket.status === "In Progress" ||
              ticket.status === "Re-Opened"
            ) {
              newOpen[ticket._id] = true;
            }
          });
          setOpenTickets(newOpen);
        }

      } else {
        setErrorMsg(res.data.message || "Failed to submit ticket.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "An error occurred.");
    }
    setSubmitting(false);
    setSuccessMsg("Support ticket submitted successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    setCategory("");
    setSubCategory("");
    setDescription("");
    setAttachments(null);
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
          <h2 className="text-xl text-blue-600 font-semibold mb-1">
            Track Support Ticket
          </h2>
          <p className="text-gray-500 mb-6">
            Track the status of your support ticket
          </p>

          {tickets.map((ticket) => {
            return (
              <div
                key={ticket._id || ticket.id || Math.random()}
                className="bg-gray-100 rounded-lg p-4 mb-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      Ticket ID: {ticket._id || ticket.id || "N/A"}
                    </span>
                    
                       <span >
                      {ticket.status!="Completed" && <button
                          title="Withdraw this ticket"
                          className="mr-1  text-red-500 hover:text-red-600 font-semibold py-2 px-2 rounded"
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await axios.put(
                                `http://localhost:5000/api/support/tickets/${
                                  ticket._id || ticket.id
                                }/withdrawn`
                              );
                              const updatedTickets = await axios.get(
                                `http://localhost:5000/api/support/tickets?userId=${userId}`
                              );
                              setTickets(updatedTickets.data.tickets || []);
                            } catch (err) {
                              alert(
                                err.response?.data?.message ||
                                  "Failed to reopen ticket."
                              );
                            }
                          }}
                        >
                          <FaTrash/>
                        </button>}
                        
                       </span>
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
                    className="text-white bg-blue-600 border-2 border-blue-600 rounded-full p-2"
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
                        if(ticket.status=='Withdrawn'){steps.push('Withdrawn')}
                        else{
                          steps.push("Completed");
                        }

                        let currentStatus = ticket.isOpen && ticket.status!="Withdrawn" &&ticket.status!="Completed" && ticket.status!="In Progress" ? "Re-Opened" : ticket.status;
                        return steps.map((step, index) => (
                          <React.Fragment key={index}>
                              <div className="relative flex flex-1 items-center">
                                <div className="flex flex-col items-center z-10">
                                  <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                                      getStepStatusDynamic(currentStatus, step, steps) === "done" ||
                                      getStepStatusDynamic(currentStatus, step, steps) === "current"
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "bg-gray-200 border-gray-300 text-gray-500"
                                    }`}
                                  >
                                    ✓
                                  </div>
                                  <span
                                    className={`mt-2 text-sm font-medium ${
                                      getStepStatusDynamic(currentStatus, step, steps) === "current"
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
                                      className={`h-1 ${
                                        getStepStatusDynamic(currentStatus, steps[index + 1], steps) !==
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

                    {/* Description */}
                    <div className="mt-6 text-center p-4 bg-gray-100 border-2 border-blue-600 rounded-lg flex items-center">
                      <span className="text-gray-500 mr-2">Resolved Description:</span>
                      <span className="text-blue-600 font-medium">
                        {ticket.Resolved_Description || "N/A"}
                      </span>
                    </div>

                    {/* Reopen Button */}
                    {ticket.status === "Completed" ||
                    ticket.status === "completed" || ticket.status==="Withdrawn" || ticket.status==="withdrawn" ? (
                      <div className="w-full flex justify-center mt-8">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await axios.put(
                                `http://localhost:5000/api/support/tickets/${
                                  ticket._id || ticket.id
                                }/reopen`
                              );
                              const updatedTickets = await axios.get(
                                `http://localhost:5000/api/support/tickets?userId=${userId}`
                              );
                              setTickets(updatedTickets.data.tickets || []);
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
