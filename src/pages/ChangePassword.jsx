// Page to handle change password

//We will use the same form as the login page
// We will accept the old password, new password and confirm new password
// We will also use show and hide password functionality

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToastContainer from "./ToastContainer";
import { FaLock, FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword() {
    const navigate = useNavigate();
    const baseUrl = "https://proposal-form-backend.vercel.app/api/profile";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const PasswordValidation = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter";
        }
        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter";
        }
        if (!hasNumber) {
            return "Password must contain at least one number";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character";
        }
        return "";
    }

    const handleChangePassword = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
                toast.error("All fields are required");
                return;
            }
            if (newPassword !== confirmNewPassword) {
                toast.error("New password and confirm new password do not match");
                return;
            }

            const newPasswordValidation = PasswordValidation(newPassword);
            if (newPasswordValidation !== "") {
                toast.error(newPasswordValidation);
                return;
            }

            setLoading(true);
            const response = await axios.put(`${baseUrl}/change-password`, {
                oldPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                toast.success("Password changed successfully");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            console.error("Password change error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to change password");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row items-center justify-center px-6 py-12">
            <ToastContainer />

            {/* Left Image */}
            <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
                <img src="/Login.png" alt="Login Illustration" className="w-2/3 max-w-sm" />
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 max-w-lg bg-[#F8F9FA] p-8 rounded-xl shadow-lg">
                <h1 className="text-[32px] font-semibold text-[#2563EB] mb-2">Change Password</h1>
                <p className="font-normal text-[16px] text-[#6B7280] mb-6">
                    Enter your old password and new password to change your password
                </p>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4 relative">
                        <label htmlFor="oldPassword" className="block text-[14px] font-medium text-[#374151] mb-2 flex items-center gap-2">
                            <FaLock className="text-[#2563EB] text-[18px]" />
                            Old Password
                        </label>
                        <input type={showOldPassword ? "text" : "password"} id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-[#D1D5DB] rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" required />
                        <button type="button" className="absolute right-3 top-10 text-gray-500 hover:text-gray-700" onClick={() => setShowOldPassword(!showOldPassword)}>
                            {showOldPassword ? <FaEyeSlash className="text-[#2563EB] text-[18px]" /> : <FaEye className="text-[#2563EB] text-[18px]" />}
                        </button>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="newPassword" className="block text-[14px] font-medium text-[#374151] mb-2 flex items-center gap-2">
                            <FaLock className="text-[#2563EB] text-[18px]" />
                            New Password
                        </label>
                        <input type={showNewPassword ? "text" : "password"} id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-[#D1D5DB] rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" required />
                        <button type="button" className="absolute right-3 top-10 text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FaEyeSlash className="text-[#2563EB] text-[18px]" /> : <FaEye className="text-[#2563EB] text-[18px]" />}
                        </button>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="confirmNewPassword" className="block text-[14px] font-medium text-[#374151] mb-2 flex items-center gap-2">
                            <FaLock className="text-[#2563EB] text-[18px]" />
                            Confirm New Password
                        </label>
                        <input type={showConfirmNewPassword ? "text" : "password"} id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-[#D1D5DB] rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" required />
                        <button type="button" className="absolute right-3 top-10 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <FaEyeSlash className="text-[#2563EB] text-[18px]" /> : <FaEye className="text-[#2563EB] text-[18px]" />}
                        </button>
                    </div>

                    <div className="mb-4">
                        <ul className="list-disc list-inside text-[14px] font-medium text-[#374151] mb-2">
                            <li>Password must be at least 8 characters long</li>
                            <li>Password must contain at least one uppercase letter</li>
                            <li>Password must contain at least one lowercase letter</li>
                            <li>Password must contain at least one number</li>
                            <li>Password must contain at least one special character</li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center gap-2" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                        <button type="submit" className="w-1/2 bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] flex items-center justify-center gap-2" disabled={loading}>
                            {loading ? <FaSpinner className="animate-spin" /> : <FaLock className="text-[#2563EB] text-[18px]" />}
                            {loading ? "Changing Password..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
