import { useState } from "react";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    location: "",
    email: "",
    mobile: "",
    jobTitle: "",
    linkedin: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-blue-600 mb-1">Your Profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter all your details to complete your account. (<span className="italic">* All fields are mandatory.</span>)
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company Name *</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mobile No. *</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email ID *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">LinkedIn *</label>
            <input
              type="text"
              name="linkedin"
              placeholder="@yourhandle"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border rounded-md mt-1 p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md">Cancel</button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">Create profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
