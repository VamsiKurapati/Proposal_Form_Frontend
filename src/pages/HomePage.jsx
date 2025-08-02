import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { MdOutlineSearch, MdViewQuilt, MdOutlineSecurity, MdChat, MdOutlineAnalytics, MdOutlineVerifiedUser, MdGroupAdd, MdOutlineCheckCircle } from "react-icons/md";
import { BiTrophy } from "react-icons/bi";

import Navbar from "./Navbar";
import Footer from "./Footer";

const features = [
  { title: "AI RFP Discovery", desc: "Find relevant RFPs matched to your business capabilities", image: <MdOutlineSearch className="w-10 h-10 text-[#2563EB]" /> },
  { title: "Smart Templates", desc: "Industry-specific templates with AI-powered customization", image: <MdViewQuilt className="w-10 h-10 text-[#2563EB]" /> },
  { title: "Compliance Check", desc: "Automated compliance against RFP verification", image: <MdOutlineSecurity className="w-10 h-10 text-[#2563EB]" /> },
  { title: "Win Probability Score", desc: "AI-powered scoring system to predict proposal success", image: <BiTrophy className="w-10 h-10 text-[#2563EB]" /> },
];

const proposalManagement = [
  {
    title: "Real-time Proposal Monitoring",
    desc: "Monitor all your proposals at one place",
    image: <MdOutlineAnalytics className="w-[34px] h-[34px] text-[#2563EB]" />,
  },
  {
    title: "Team Collaboration Tools",
    desc: "Work together seamlessly with your team",
    image: <MdGroupAdd className="w-[34px] h-[34px] text-[#2563EB]" />,
  },
  {
    title: "Performance Analytics",
    desc: "Data-driven insights for better decisions",
    image: <MdChat className="w-[34px] h-[34px] text-[#2563EB]" />,
  },
  {
    title: "Automated Compliance",
    desc: "Ensure your proposals meet all regulatory requirements",
    image: <MdOutlineVerifiedUser className="w-[34px] h-[34px] text-[#2563EB]" />,
  },
];

const benefits = [
  {
    title: "DISCOVER",
    subtitle: "AI RFP Discovery",
    desc: "Uncover the right opportunities faster with AI-powered search and personalized RFP recommendations based on your industry, preferences, and history.",
    image: "/why_1.png",
  },
  {
    title: "GENERATE",
    subtitle: "Smart Templates",
    desc: "Build compelling, high-converting proposals instantly using dynamic templates, auto-filled sections, and real-time AI-driven content enhancements.",
    image: "/why_2.png",
  },
  {
    title: "COLLABORATE",
    subtitle: "Team Collaboration Tools",
    desc: "Bring your entire team together with live co-editing, threaded comments, version control, and seamless workflow — all in one collaborative workspace.",
    image: "/why_3.png",
  },
  {
    title: "ANALYZE",
    subtitle: "Performance Analytics",
    desc: "Run instant compliance checks to flag missing sections, formatting errors, and legal gaps — so your proposals are error-free and submission-ready.",
    image: "/why_4.png",
  },
  {
    title: "MANAGE",
    subtitle: "Real-time Proposal Tracking",
    desc: "Visualize every stage of your proposal lifecycle — from drafting to submission — with real-time status updates, deadline alerts, and performance insights.",
    image: "/why_5.png",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$99",
    features: [
      "Basic RFP Discovery",
      "5 Smart Templates",
      "Basic Compliance Check",
      "Email Support",
    ],
    button: "Get Started",
  },
  {
    name: "Professional",
    price: "$199",
    popular: true,
    features: [
      "Advanced RFP Discovery",
      "Unlimited Templates",
      "Advanced Compliance Check",
      "Win Probability Score",
      "Team Collaboration",
      "Priority Support",
    ],
    button: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom RFP Discovery",
      "Custom Templates",
      "Enterprise Compliance",
      "Custom Integration",
    ],
    button: "Contact Sales",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="w-full font-inter bg-white">
      <Navbar />

      <div className="fixed top-1/2 sm:top-[60%] lg:top-[70%] right-1 sm:right-4 w-12 sm:w-16 h-12 sm:h-[62px] bg-[#2563EB] rounded-xl">
        <button
          className="w-full h-full flex items-center justify-center"
          onClick={() => navigate('/login')}
        >
          <MdChat className="w-12 sm:w-10 h-8 sm:h-10 text-[#FFFFFF]" />
        </button>
      </div>

      {/* Hero Section */}
      <section
        className="mt-12 sm:mt-[62px]"
        style={{ background: "linear-gradient(180deg, #EEF4FF 50%, #FFFFFF 100%)" }} >
        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 md:py-16">
          {/* Left Text Section */}
          <div className="w-full md:w-1/2 text-left mb-10 md:mb-0">
            <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-[#000000] leading-tight">
              Transform Your RFP Process with AI-Powered Intelligence
            </h1>
            <p className="text-[14px] lg:text-[16px] text-[#6B7280] font-medium mt-4">
              Transform your RFP process with intelligent suggestions, compliance checks, and win probability scoring.
            </p>
            <div className="md:hidden w-full xs:w-[70%] h-[200px] mx-auto md:h-full lg:w-1/2 mt-4">
              <img
                src="/homepage.png"
                alt="Hero Analytics Dashboard"
                className="w-full h-full rounded shadow-lg"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-[#2563EB] px-3 sm:px-6 py-2 rounded-lg text-[16px] text-[#FFFFFF] font-regular"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
              <button className="border border-1 border-[#00000033] px-3 sm:px-6 py-2 rounded-lg flex items-center gap-2 text-[16px] text-[#000000] font-regular"
                onClick={() => navigate("/")}
              >
                <FaPlay className="text-[#000000]" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="hidden md:block w-[90%] xs:w-[50%] h-[200px] md:h-full lg:w-1/2">
            <img
              src="/homepage.png"
              alt="Hero Analytics Dashboard"
              className="w-full h-full rounded shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="bg-white scroll-mt-20">
        <div className="py-8 md:py-16 px-8 md:px-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="mx-auto text-[30px] text-[#000000] font-semi-bold">Streamline your RFP Process</h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="bg-[#0000000A] border border-2 border-[#E5E7EB] p-4 rounded-xl shadow hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4"> {item.image} </div>
                <div className="flex flex-col items-start text-left gap-2">
                  <h3 className="font-medium text-[20px] text-[#111827]">{item.title}</h3>
                  <p className="font-regular text-[16px] text-[#6B7280]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive Proposal Management */}
        <div className="py-8 md:py-16 bg-white px-8 md:px-16">
          <h2 className="text-[30px] font-semi-bold mb-4">Comprehensive Proposal Management</h2>
          <div className="flex gap-8 flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <img src="/proposal_management.png" alt="Proposal Management" className="w-full rounded-lg shadow-lg mb-4" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {proposalManagement.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center mt-1">
                    {item.image}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <h3 className="text-[24px] font-semibold text-[#111827]">{item.title}</h3>
                    <p className="text-[16px] text-[#6B7280] font-regular">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AI RFP */}
      <section className="py-8 md:py-16 bg-white px-8 md:px-16 scroll-mt-20" id="solutions">
        <h2 className="text-[30px] font-semi-bold mb-4">Why Choose AI RFP?</h2>
        {benefits.map((item, idx) => (
          <div key={idx} className={`flex flex-row items-center justify-center text-left gap-4 xs:gap-8 lg:gap-20 space-y-4 lg:px-8 mb-8 lg:mb-12 ${idx % 2 === 1 ? "flex-row" : "flex-row-reverse"}`}>
            <img src={item.image} alt={item.title} className="w-[100px] xs:w-[150px] md:w-[250px] lg:w-[300px] h-[120px] xs:h-[200px] md:h-full object-cover rounded-lg mb-4" />
            <div className="flex flex-col items-left gap-2 mb-2">
              <h4 className="text-[#2563EB] text-[24px] sm:text-[32px] md:text-[36px] font-bold">{item.title}</h4>
              <h3 className="text-[#111827] text-[20px] sm:text-[28px] md:text-[32px] font-medium">{item.subtitle}</h3>
              <p className="text-[#6B7280] text-[14px] sm:text-[20px] md:text-[22px] font-regular">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Plans Section */}
      <section className="pb-20 bg-white px-8 md:px-16 scroll-mt-20" id="plans">
        <h2 className="text-[30px] text-[#000000] font-bold mb-8">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`p-6 border border-2 text-left rounded-xl ${plan.popular ? "border-[#2563EB]" : "border-[#E5E7EB] "}`}>
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="text-[12px] text-[#FFFFFF] bg-[#2563EB] font-regular mb-2 py-2 px-2 rounded-lg inline-block">Most Popular</span>
                </div>
              )}
              <h3 className="text-[20px] text-[#111827] font-semibold">{plan.name}</h3>
              <p className="text-[28px] text-[#000000] font-bold">{plan.price} {plan.price !== "Custom" && (<span className="text-[20px] text-[#6B7280] font-regular"> /month</span>)}</p>
              <ul className="text-left mt-4 space-y-2 text-sm text-gray-700">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <MdOutlineCheckCircle className="text-green-500 w-[20px] h-[20px]" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button className={`mt-4 w-full ${plan.popular ? "bg-[#2563EB] text-[#FFFFFF] " : "bg-[#FFFFFF] text-[#000000]"} border border-1 border-[#00000033] py-2 rounded-lg`}
                onClick={() => navigate("/login")}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#1E293B] text-center py-12 px-8 md:px-16">
        <h3 className="text-[36px] text-[#FFFFFF] font-semi-bold mb-2">Ready to get started</h3>
        <p className="text-[#FFFFFF] text-[16px] font-medium mb-4">Join thousands of satisfied customers and transform your business today.</p>
        {/* <div className="flex flex-col sm:flex-row mx-auto justify-center gap-4">
          <button className="mx-auto bg-[#2563EB] text-white px-6 py-2 rounded-lg text-[16px] text-[#FFFFFF] font-regular">
            Get Started
          </button>
          <button className="mx-auto bg-[#FFFFFF] border border-1 border-[#00000033] px-6 py-2 rounded-lg flex items-center gap-2 text-[16px] text-[#000000] font-regular">
            <FaPlay className="text-[#000000]" />
            Watch Demo
          </button>
        </div> */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="w-[140px] sm:w-auto bg-[#2563EB] hover:bg-[#1d4ed8] transition text-white px-6 py-2 rounded-lg text-[16px] font-medium shadow"
            onClick={() => navigate("/")}
          >
            Get Started
          </button>
          <button className="w-[180px] sm:w-auto bg-white hover:bg-gray-100 transition border border-gray-300 px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-[16px] text-black font-medium shadow"
            onClick={() => navigate("/")}
          >
            <FaPlay className="text-black" />
            Watch Demo
          </button>
        </div>
      </section>

      <Footer />
    </section>
  );
}
