import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToastContainer from "./ToastContainer";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useUser();
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
      if (res.status === 200) {
        toast.success("Login successful");
        const token = res.data.token;
        const role = res.data.user.role;
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", token);
        setRole(role === "company" ? "company" : res.data.user.accessLevel || "Viewer");
        localStorage.setItem("userRole", role === "company" ? "company" : res.data.user.accessLevel || "Viewer");
        console.log("Role in LoginPage: ", role === "company" ? "company" : res.data.user.accessLevel || "Viewer Access");
        role === "company" ? navigate("/company_profile_dashboard") : navigate("/employee_profile_dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 bg-white">
      <ToastContainer />
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

