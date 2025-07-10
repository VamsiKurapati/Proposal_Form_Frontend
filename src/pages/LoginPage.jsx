// import React from "react";

// const LoginPage = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center justify-center">
//         {/* Left Section - Illustration */}
//         <div className="flex justify-center items-center">
//           <div className="relative">
//             <div className="p-10 rounded shadow-md w-[90%] sm:w-[421px] h-[200px] md:h-[381px] relative">
//               <div className="absolute bottom-0 left-8">
//                 <img
//                   src="/Login.png" // Example illustration
//                   alt="Illustration"
//                   className="w-full h-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Section - Form */}
//         <div className="p-8">
//           <h1 className="text-[36px] text-[#000000] font-extra-bold italic mb-1">LOGO</h1>
//           <h2 className="text-[32px] font-semibold text-[#2563EB]">Log In</h2>
//           <p className="text-[#6B7280] text-[16px] mb-6">Welcome back! Login to continue</p>

//           <form className="space-y-8">
//             <div className="mb-2">
//               <label htmlFor="email" className="text-[24px] font-medium text-[#111827] mb-1">
//                 Email id
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your company email id"
//                 className="w-full sm:w-[80%] md:w-[90%] lg:w-[500px] px-4 py-3 rounded-md bg-[#0000000F] focus:outline-none"
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="password" className="text-[24px] font-medium text-[#111827] mb-1">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full sm:w-[80%] md:w-[90%] lg:w-[500px] px-4 py-3 rounded-md bg-[#0000000F] focus:outline-none"
//               />
//             </div>

//             <button
//               type="submit"
//               className="mt-6 w-full sm:w-[80%] md:w-[90%] lg:w-[500px] bg-[#2563EB] text-white py-3 rounded font-semibold text-[20px] transition duration-200"
//             >
//               Log In
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('https://proposal-form-backend.vercel.app/api/auth/login', form);
      const token = res.data.token;
      localStorage.setItem("token", token); // Store JWT
      alert("Login successful!");
      navigate("/company_profile_dashboard"); // Redirect to profile page
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 bg-white">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
        <img src="/Login.png" alt="Login Illustration" className="w-2/3 max-w-sm" />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 max-w-lg">
        <h1 className="text-[36px] text-[#000000] font-bold italic mb-2">LOGO</h1>
        <h2 className="text-[32px] font-semibold text-[#2563EB] mb-1">Log In</h2>
        <p className="font-normal text-[16px] text-[#6B7280] mb-6">
          Welcome back! Login to continue
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[24px] text-[#111827] font-medium mb-1">Email id</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your company email id"
              value={form.email}
              onChange={handleChange}
              className={`w-full bg-[#0000000F] text-[16px] text-[#6B7280] p-3 rounded-md ${errors.email ? "border border-red-500" : ""
                }`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-[24px] text-[#111827] font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={`w-full bg-[#0000000F] text-[16px] text-[#6B7280] p-3 rounded-md pr-12 ${errors.password ? "border border-red-500" : ""
                }`}
            />
            <button
              type="button"
              className="absolute right-3 top-[52px]  text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
        </div>

        <button
          className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-md font-semibold text-[20px] hover:bg-blue-700 disabled:opacity-50"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        <div className="mt-4 text-center text-[16px] text-gray-600">
          Don’t have an account?{" "}
          <a href="/sign_up" className="text-[#2563EB] font-medium hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

