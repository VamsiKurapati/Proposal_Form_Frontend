import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdOutlineSearch,
  MdOutlineFilterList,
  MdOutlineFileUpload,
  MdOutlineVisibility,
} from "react-icons/md";

const baseUrl = "http://localhost:5000/api";

const ShowCustomDetails = () => {
  const [customPlans, setCustomPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(null);
  const [customToggle, setCustomToggle] = useState(false);
  const [transaction_id, setTransaction_id] = useState(null);



  const handleCustomDelete=(id)=>{
    axios.delete(`${baseUrl}/admin/deleteCustomPlan/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      alert("Custom plan deleted successfully");
      setCustomPlans(customPlans.filter((plan) => plan._id !== id));
      setFilteredPlans(filteredPlans.filter((plan) => plan._id !== id));
    }).catch((error) => {
      alert("Failed to delete custom plan");
      console.error(error);
    });
  }

  const [formData, setFormData] = useState({
    email: "",
    price: "",
    planType: "",
    maxEditors: "",
    maxViewers: "",
    maxRFPProposalGenerations: "",
    maxGrantProposalGenerations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    // Check if any form details are missing
    const requiredFields = [
      "email",
      "price",
      "planType",
      "maxEditors",
      "maxViewers",
      "maxRFPProposalGenerations",
      "maxGrantProposalGenerations",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        alert("Please fill in all the fields before submitting.");
        return;
      }
    }
    setLoading(true);
    axios
      .post(`${baseUrl}/admin/updateSubscriptionPlanCustom`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Your request has been sent successfully!");
        setFormData({
          email: "",
          price: "",
          planType: "",
          maxEditors: "",
          maxViewers: "",
          maxRFPProposalGenerations: "",
          maxGrantProposalGenerations: "",
        });
        setCustomToggle(false);
      })
      .catch((error) => {
        alert("Failed to send request. Please try again.");
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchCustomPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/admin/getCustomPlanData`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setCustomPlans(response.data);
        setFilteredPlans(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomPlans();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = customPlans.filter(
      (plan) =>
        plan.companyName.toLowerCase().includes(term.toLowerCase()) ||
        plan.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ["Company", "Email", "Plan Type"].join(","),
      ...filteredPlans.map((plan) =>
        [plan.companyName, plan.email, plan.planType].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-plans.csv";
    link.click();
  };


  const handleCustomSubmitfinal = (
    id,
    email,
    price,
    planType,
    maxEditors,
    maxViewers,
    maxRFPProposalGenerations,
    maxGrantProposalGenerations,
    transaction_id,
    companyName 
  ) => {
    const payload = {
      email,
      price,
      planType,
      maxEditors,
      maxViewers,
      maxRFPProposalGenerations,
      maxGrantProposalGenerations,
      transaction_id,
      companyName,
    };
  
    setLoading(true);
    axios
      .post(`${baseUrl}/admin/createCustomPlan`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Custom plan submitted successfully!");
        setCustomToggle(false);
      })
      .catch((error) => {
        alert("Failed to submit custom plan");
        console.error(error);
      })
      .finally(() => setLoading(false));
  };
  

  return (
    <div className="p-6">
      {/* Search and Filter Bar */}
      <div className="mb-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative">
              <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-colors w-full sm:w-auto"
                onClick={() => setFilterModal(!filterModal)}
              >
                <MdOutlineFilterList className="w-5 h-5" />
                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
              </button>
              {filterModal && (
                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50 border border-[#E5E7EB]">
                  <button
                    onClick={() => {
                      setFilteredPlans(customPlans);
                      setFilterModal(false);
                    }}
                    className="text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add Custom Plan Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setCustomToggle(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg font-medium hover:bg-green-600"
            >
              + Add
            </button>
          </div>

          {/* Export Button */}
          <div className="flex items-center justify-center sm:justify-end">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-colors w-full sm:w-auto"
            >
              <MdOutlineFileUpload className="w-5 h-5" />
              <span className="text-[16px] text-white">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
        <table className="w-full rounded-2xl">
          <thead className="bg-[#F8F8FF] border-b border-[#0000001A]">
            <tr>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                CompanyName
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Email
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Plan Type
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-red-500">
                  Error: {error.message}
                </td>
              </tr>
            ) : filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <React.Fragment key={plan._id}>
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 text-[16px] text-[#4B5563]">
                      {plan.companyName}
                    </td>
                    <td className="p-4 text-[16px] text-[#4B5563]">
                      {plan.email}
                    </td>
                    <td className="p-4 text-[16px] text-[#6C63FF]">
                      {plan.planType}
                    </td>
                    <td className="p-4">
                      <button
                        className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                        onClick={() =>
                          setOpenDetails(
                            openDetails === plan._id ? null : plan._id
                          )
                        }
                        title="View Details"
                      >
                        <MdOutlineVisibility className="w-5 h-5 text-[#6C63FF]" />
                      </button>
                    </td>
                  </tr>
                  {openDetails === plan._id && (
                      <tr>
                        <td colSpan={4} className="bg-gray-50 p-6">
                          <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
                            <div className="space-y-2">
                              <p><strong>Price:</strong> ${plan.price}</p>
                              <p><strong>Max Editors:</strong> {plan.maxEditors}</p>
                              <p><strong>Max Viewers:</strong> {plan.maxViewers}</p>
                            </div>

                            <div className="space-y-2">
                              <p><strong>Max RFP:</strong> {plan.maxRFPProposalGenerations}</p>
                              <p><strong>Max Grant:</strong> {plan.maxGrantProposalGenerations}</p>
                              <div>
                                <strong>Transaction ID:</strong>
                                <input
                                  type="text"
                                  name="transaction_id"
                                  value={plan.transaction_id}
                                  onChange={(e) => setTransaction_id(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                  placeholder="Enter Transaction ID"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-6">
                            <button
                              onClick={() => handleCustomDelete(plan._id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg transition-colors hover:bg-red-700 shadow-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleCustomSubmitfinal(
                                  plan._id,
                                  plan.email,
                                  plan.price,
                                  plan.planType,
                                  plan.maxEditors,
                                  plan.maxViewers,
                                  plan.maxRFPProposalGenerations,
                                  plan.maxGrantProposalGenerations,
                                  plan.transaction_id,
                                  plan.companyName
                                )
                              }
                              className="flex-1 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white py-2 rounded-lg transition-colors hover:bg-gradient-to-b hover:from-[#3F73BD] hover:to-[#6C63FF] shadow-sm"
                            >
                              Submit Customised Plan
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No custom plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {customToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setCustomToggle(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            {loading ? <div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div> : <div>

            
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Custom Plan Details
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your email"
              />

              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter price"
              />

                
                <select
                name="planType"
                value={formData.planType}
                onChange={handleChange}
                className="w-full text-gray-400 border rounded-lg px-3 py-2"
                >
                <option value="">Select plan type</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                </select>

              <input
                type="number"
                name="maxEditors"
                value={formData.maxEditors}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter number of editors"
              />

              <input
                type="number"
                name="maxViewers"
                value={formData.maxViewers}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter number of viewers"
              />

              <input
                type="number"
                name="maxRFPProposalGenerations"
                value={formData.maxRFPProposalGenerations}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter max RFP generations"
              />

              <input
                type="number"
                name="maxGrantProposalGenerations"
                value={formData.maxGrantProposalGenerations}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter max grant generations"
              />

              <button
                onClick={handleCustomSubmit}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg hover:bg-gradient-to-b hover:from-[#3F73BD] hover:to-[#6C63FF]"
              >
                Submit Request
              </button>
            </div>
            </div>}

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowCustomDetails;
