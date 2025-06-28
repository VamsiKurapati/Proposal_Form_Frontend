// import { useState } from "react";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import axios from "axios";

// const SignupForm = () => {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//     organization: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const validateStepOne = () => {
//     const newErrors = {};
//     if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(form.email)) {
//         newErrors.email = "Enter a valid company email address";
//     }
//     if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
//     if (form.password !== form.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     return newErrors;
//   };

//   const validateStepTwo = () => {
//     const newErrors = {};
//     const intlMobileRegex = /^\+?[1-9]\d{7,14}$/;
//     if (!intlMobileRegex.test(form.mobile.replace(/[\s-]/g, ""))) {
//         newErrors.mobile = "Enter a valid international mobile number";
//     }
//     if (!form.organization.trim()) newErrors.organization = "Organization is required";
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     const stepTwoErrors = validateStepTwo();
//     if (Object.keys(stepTwoErrors).length > 0) {
//       setErrors(stepTwoErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post('https://proposal-form-backend.vercel.app/api/auth/signup', form);
//       alert("Signup successful!");
//     } catch (error) {
//       alert("Signup failed: " + (error.response?.data?.message || "Server error"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 bg-white">
//       <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
//         <img src="/Sign_Up.png" alt="SignUp" className="w-2/3 max-w-sm" />
//       </div>

//       <div className="w-full md:w-1/2 max-w-lg">
//         <h1 className="text-[36px] text-[#000000] font-bold italic mb-2">LOGO</h1>
//         <h2 className="text-[32px] font-semibold text-[#2563EB] mb-1">Sign up</h2>
//         <p className="font-normal text-[16px] text-[#6B7280] mb-6">
//           Enter your work details to create your account
//         </p>

//         {step === 1 ? (
//           <>
//             <div className="space-y-4">
//               {["fullName", "email", "password", "confirmPassword"].map((field, i) => (
//                 <div key={field}>
//                   <label className="text-[24px] text-[#111827] font-medium mb-1 block">
//                     {field === "fullName"
//                       ? "Full Name"
//                       : field === "email"
//                       ? "Company email id"
//                       : field === "password"
//                       ? "Create new password"
//                       : "Confirm new password"}
//                   </label>
//                   <input
//                     type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
//                     name={field}
//                     placeholder={
//                       field === "confirmPassword"
//                         ? "Rewrite the new password to confirm"
//                         : field === "password"
//                         ? "Minimum 8 characters"
//                         : `Enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
//                     }
//                     value={form[field]}
//                     onChange={handleChange}
//                     className={`w-full bg-[#0000000F] text-[16px] text-[#6B7280] p-3 rounded-md ${
//                       errors[field] ? "border border-red-500" : ""
//                     }`}
//                   />
//                   {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
//                 </div>
//               ))}
//             </div>
//             <div className="text-right mt-6">
//               <button
//                 onClick={() => {
//                   const validation = validateStepOne();
//                   if (Object.keys(validation).length === 0) {
//                     setStep(2);
//                   } else {
//                     setErrors(validation);
//                   }
//                 }}
//                 className="text-[#2563EB] text-[22px] font-medium inline-flex items-center justify-center gap-1"
//               >
//                 Next <ArrowRight className="w-5 md:w-6 h-5 md:h-6" />
//               </button>
//             </div>
//             <div className="mt-4 text-center text-[16px] text-gray-600">
//                 Existing User?{" "}
//                 <a href="/Login" className="text-[#2563EB] font-medium hover:underline">
//                     Log In
//                 </a>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="space-y-4">
//               <button
//                 onClick={() => setStep(1)}
//                 className="text-[#2563EB] text-[22px] font-medium inline-flex items-center justify-center gap-1"
//               >
//                 <ArrowLeft className="w-5 md:w-6 h-5 md:h-6" /> Back
//               </button>

//               {["mobile", "organization"].map((field) => (
//                 <div key={field}>
//                   <label className="text-[24px] text-[#111827] font-medium mb-1 block">
//                     {field === "mobile" ? "Mobile Number" : "Company/Organization"}
//                   </label>
//                   <input
//                     type={field === "mobile" ? "tel" : "text"}
//                     name={field}
//                     placeholder={`Enter your ${field === "mobile" ? "mobile number" : "organization name"}`}
//                     value={form[field]}
//                     onChange={handleChange}
//                     className={`w-full bg-[#0000000F] text-[16px] text-[#6B7280] p-3 rounded-md ${
//                       errors[field] ? "border border-red-500" : ""
//                     }`}
//                   />
//                   {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
//                 </div>
//               ))}
//             </div>

//             <button
//               className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Submitting..." : "Sign Up"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignupForm;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // Step 0 = Choose Role
  const [role, setRole] = useState(""); // company | employee

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    organization: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStepOne = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Enter a valid email address";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    const intlMobileRegex = /^\+?[1-9]\d{7,14}$/;
    if (!intlMobileRegex.test(form.mobile.replace(/[\s-]/g, ""))) {
      newErrors.mobile = "Enter a valid international mobile number";
    }
    if (!form.organization.trim()) newErrors.organization = "Organization is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const stepTwoErrors = validateStepTwo();
    if (Object.keys(stepTwoErrors).length > 0) {
      setErrors(stepTwoErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // await axios.post("https://proposal-form-backend.vercel.app/api/auth/signup", {
      //   ...form,
      //   role,
      // });
      navigate("/create-profile", { state: { role , signupData: form } });
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || "Server error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 bg-white">
        {/* STEP 0 - JOIN AS */}
        {step === 0 && (
          <div className="space-y-4 text-center">
            <h1 className="text-[36px] text-[#000000] font-bold italic mb-2">LOGO</h1>
            <h2 className="text-[32px] font-semibold text-[#2563EB] mb-4">Welcome to (AI RFP)</h2>
            <h3 className="text-[32px] font-medium text-[#111827]">Join as</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setRole("company");
                  setStep(1);
                }}
                className="bg-[#2563EB] text-white py-2 rounded-md font-semibold"
              >
                Company
              </button>
              <button
                onClick={() => {
                  setRole("employee");
                  setStep(1);
                }}
                className="border border-1 border-[#2563EB] text-[#2563EB] py-2 rounded-md font-semibold"
              >
                Employee
              </button>
            </div>
          </div>
        )}

        {step > 0 && (
          <>
            <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
              <img src="/Sign_Up.png" alt="SignUp" className="w-2/3 max-w-sm" />
            </div>

            <div className="w-full md:w-1/2 max-w-lg">
              <h1 className="text-[36px] text-[#000000] font-bold italic mb-2">LOGO</h1>
              <h2 className="text-[32px] font-semibold text-[#2563EB] mb-1">Sign up</h2>
              <p className="font-normal text-[16px] text-[#6B7280] mb-6">
                Enter your work details to create your account
              </p>

              {/* STEP 1 - BASIC DETAILS */}
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    {["fullName", "email", "password", "confirmPassword"].map((field) => (
                      <div key={field}>
                        <label className="block text-lg font-medium text-gray-800 mb-1">
                          {field === "fullName"
                            ? "Full Name"
                            : field === "email"
                            ? "Email"
                            : field === "password"
                            ? "Create Password"
                            : "Confirm Password"}
                        </label>
                        <input
                          type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                          name={field}
                          placeholder={
                            field === "password"
                              ? "Minimum 8 characters"
                              : field === "confirmPassword"
                              ? "Retype password"
                              : `Enter ${field}`
                          }
                          value={form[field]}
                          onChange={handleChange}
                          className={`w-full p-3 bg-[#0000000F] rounded-md ${
                            errors[field] ? "border border-red-500" : ""
                          }`}
                        />
                        {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="text-right mt-6">
                    <button
                      onClick={() => {
                        const validation = validateStepOne();
                        if (Object.keys(validation).length === 0) {
                          setStep(2);
                        } else {
                          setErrors(validation);
                        }
                      }}
                      className="text-[#2563EB] text-[22px] font-medium inline-flex items-center justify-center gap-1"
                    >
                      Next <ArrowRight />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 - EXTRA DETAILS */}
              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <button
                      onClick={() => setStep(1)}
                      className="text-[#2563EB] text-[22px] font-medium inline-flex items-center justify-center gap-1"
                    >
                      <ArrowLeft /> Back
                    </button>

                    {["mobile", "organization"].map((field) => (
                      <div key={field}>
                        <label className="text-lg font-medium text-gray-800 mb-1 block">
                          {field === "mobile" ? "Mobile Number" : "Organization Name"}
                        </label>
                        <input
                          type={field === "mobile" ? "tel" : "text"}
                          name={field}
                          placeholder={`Enter ${field}`}
                          value={form[field]}
                          onChange={handleChange}
                          className={`w-full p-3 bg-[#0000000F] rounded-md ${
                            errors[field] ? "border border-red-500" : ""
                          }`}
                        />
                        {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSubmit}
                    // onClick={() => navigate("/create-profile", { state: {role}})}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Sign Up"}
                  </button>
                </>
              )}

              <div className="mt-4 text-center text-[16px] text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-[#2563EB] font-medium hover:underline">
                  Log In
                </a>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default SignupForm;
