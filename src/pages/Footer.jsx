import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <>
            {/* Footer */}
            <footer className="white text-black py-10 px-8 md:px-16">
                <div className="grid xs:grid-cols-1 sm:grid-cols-4 gap-2 lg:gap-4 text-sm">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h4 className="font-bold mb-4">LOGO</h4>
                        <p className="text-[16px] text-[#1E293B] font-regular mb-4">Transforming RFP management with AI-powered solutions</p>
                        <div className="flex items-center justify-center xs:justify-start mb-4">
                            <LuLinkedin className="w-6 h-6 text-[#1E293B] mr-4 inline-block" />
                            <LuTwitter className="w-6 h-6 text-[#1E293B] mr-4 inline-block" />
                            <LuInstagram className="w-6 h-6 text-[#1E293B] inline-block" />
                        </div>
                    </div>
                    <div className="flex flex-col xs:flex-row justify-center items-start text-left gap-8 sm:gap-24 mx-auto">
                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-[18px] text-[#000000] font-semibold mb-4">Product</h4>
                            <ul className="text-[16px] text-[#1E293B] font-regular space-y-2">
                                <li>Features</li>
                                <li>Templates</li>
                                <li>Pricing</li>
                            </ul>
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-[18px] text-[#000000] font-semibold mb-4">Resources</h4>
                            <ul className="text-[16px] text-[#1E293B] font-regular space-y-2">
                                <li>Documentation</li>
                                <li>Guide</li>
                                <li>Support</li>
                            </ul>
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-[18px] text-[#000000] font-semibold mb-4">Company</h4>
                            <ul className="text-[16px] text-[#1E293B] font-regular space-y-2">
                                <li>About</li>
                                <li>Blog</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-1 border-[#1E293B]" />
                <p className="text-left mt-8  ml-12 text-xs text-black">© 2025. All Rights Reserved.</p>
            </footer>
        </>
    )
}