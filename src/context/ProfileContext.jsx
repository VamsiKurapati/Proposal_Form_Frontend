import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    const { role } = useUser();

    useEffect(() => {
        console.log("Role in ProfileContext: ", role);
    }, [role]);

    // Mock data fallback (copy from CompanyProfileDashboard)
    const getMockCompanyData = useCallback(() => ({
        companyName: "ABC Company Inc.",
        adminName: "John Doe",
        industry: "Technology Solutions & Consulting",
        location: "San Francisco, CA",
        email: "myname@email.com",
        phone: "+91-5877486484",
        website: "www.mywebsite.com",
        stats: {
            totalProposals: 156,
            wonProposals: 50,
            successRate: "55%",
            activeProposals: 12,
        },
        profile: {
            bio: "ABC Company Inc. is a leading technology consulting firm specializing in digital transformation, cloud solutions and enterprise software development. With over 15 years of experience, we help businesses leverage technology to achieve their strategic objectives.",
            services: ["Cloud Architecture", "Enterprise Solutions", "Data Analytics", "Enterprise Solutions", "Data Analytics", "Cloud Architecture", "Data Analytics", "Cloud Architecture", "Enterprise Solutions"],
        },
        certificationsList: [
            {
                name: "GDPR Compliant",
                issuer: "European Commission",
                validTill: "Dec 2025",
            },
            {
                name: "Financial Planning Certificate",
                issuer: "Barone LLC.",
                validTill: "Dec 2025",
            },
            {
                name: "Training Certificate",
                issuer: "Barone LLC.",
                validTill: "Dec 2025",
            },
            {
                name: "CPR Certification",
                issuer: "Abstergo Ltd.",
                validTill: "Dec 2025",
            },
            {
                name: "Certificate of Completion",
                issuer: "Acme Co.",
                validTill: "Dec 2025",
            },
            {
                name: "Leadership Certificate",
                issuer: "Biffco Enterprises Ltd.",
                validTill: "Dec 2025",
            },
            {
                name: "Fitness Instructor Certification",
                issuer: "Big Kahuna Burger Ltd.",
                validTill: "Dec 2025",
            },
            {
                name: "Certificate of Achievement",
                issuer: "Binford Ltd.",
                validTill: "Dec 2025",
            },
        ],
        deadlines: [
            { title: "Client Presentation", date: "Jan 20, 2024", status: "Urgent" },
            { title: "Proposal Review", date: "Jan 20, 2024", status: "Scheduled" },
            { title: "Team Meeting", date: "Jan 20, 2024", status: "On Track" },
            { title: "Review Session", date: "Jan 20, 2024", status: "Pending" },
        ],
        activity: [
            { title: "New proposal submitted", date: "Jan 20, 2024" },
            { title: "Document updated", date: "Jan 20, 2024" },
            { title: "Team meeting scheduled", date: "Jan 20, 2024" },
        ],
        companyDetails: {
            "No.of employees": { value: "10-100" },
            "Team Size": { value: 10 },
            "Department": { value: 16 },
            "Founded": { value: 2000 },
        },
        employees: [
            { name: "Sara Johnson", jobTitle: "CEO & Founder", accessLevel: "Full Access" },
            { name: "Darrell Steward", jobTitle: "President of Sales", accessLevel: "Admin" },
            { name: "Cody Fisher", jobTitle: "Medical Assistant", accessLevel: "Admin" },
            { name: "Eleanor Pena", jobTitle: "Medical Assistant", accessLevel: "Editor" },
            { name: "Theresa Webb", jobTitle: "Medical Assistant", accessLevel: "Editor" },
            { name: "Bessie Cooper", jobTitle: "Web Designer", accessLevel: "Editor" },
            { name: "Darrell Steward", jobTitle: "Dog Trainer", accessLevel: "Editor" },
            { name: "Jane Cooper", jobTitle: "Dog Trainer", accessLevel: "Editor" },
            { name: "Leslie Alexander", jobTitle: "Nursing Assistant", accessLevel: "Editor" },
            { name: "Ralph Edwards", jobTitle: "Dog Trainer", accessLevel: "Viewer" },
            { name: "Cody Fisher", jobTitle: "President of Sales", accessLevel: "Viewer" },
            { name: "Devon Lane", jobTitle: "Web Designer", accessLevel: "Viewer" },
        ],
        proposalList: [
            { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
            { title: "Social Media Proposal", company: "GlobalTech Corp", status: "Rejected", date: "Jan 20, 2026", amount: 200000 },
            { title: "Something Proposal", company: "GlobalTech Corp", status: "Won", date: "Jan 20, 2026", amount: 200000 },
            { title: "Web Development Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
            { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
            { title: "Something Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
            { title: "Web Development Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
            { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "Won", date: "Jan 20, 2026", amount: 200000 },
            { title: "Data Analytics Proposal", company: "GlobalTech Corp", status: "In Progress", date: "Jan 20, 2026", amount: 200000 },
            { title: "Social Media Proposal", company: "GlobalTech Corp", status: "Submitted", date: "Jan 20, 2026", amount: 200000 },
        ],
        documentList: [
            { name: "A_Journey_Through_Love.pdf", type: "PDF", size: "578 KB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Unlocking_the_Secrets.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Mastering_Your_Personal_Finances.pdf", type: "PDF", size: "4 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Treasured_Family_Favorites.pdf", type: "PDF", size: "2.3 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Ultimate_Dream_Vacation.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Exploring_World_History.pdf", type: "PDF", size: "1.4 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "The_Great_Artistic_Masters.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Comprehensive_Financial_Planning.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Exploring_Unknown_Worlds.pdf", type: "PDF", size: "4 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "All-Encompassing_Residency.pdf", type: "PDF", size: "983 KB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "The_Wonders_of_Nature.pdf", type: "PDF", size: "2 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "Inspiration_and_Creativity.pdf", type: "PDF", size: "1.1 MB", lastModified: "Jan 15, 2026", fileId: "123" },
            { name: "The_Academic_Journey.pdf", type: "PDF", size: "2.3 MB", lastModified: "Jan 15, 2026", fileId: "123" },
        ],
        caseStudiesList: [
            {
                title: "Digital Transformation Success Story",
                description: "How we helped a Fortune 500 company modernize their legacy systems and improve operational efficiency by 40%",
                readTime: "8 min read",
                fileUrl: "/case-studies/digital-transformation-2024.pdf"
            },
            {
                title: "Cloud Migration Case Study",
                description: "Complete migration of enterprise applications to AWS, reducing infrastructure costs by 60% while improving performance",
                readTime: "12 min read",
                fileUrl: "/case-studies/cloud-migration-success.pdf"
            },
            {
                title: "AI-Powered Analytics Implementation",
                description: "Implementation of machine learning algorithms for predictive analytics, resulting in 25% increase in customer retention",
                readTime: "10 min read",
                fileUrl: "/case-studies/ai-analytics-implementation.pdf"
            },
            {
                title: "Cybersecurity Infrastructure Overhaul",
                description: "Comprehensive security assessment and implementation of zero-trust architecture for a financial services client",
                readTime: "15 min read",
                fileUrl: "/case-studies/cybersecurity-overhaul.pdf"
            },
            {
                title: "Mobile App Development Success",
                description: "End-to-end development of a cross-platform mobile application serving 100,000+ users with 99.9% uptime",
                readTime: "6 min read",
                fileUrl: "/case-studies/mobile-app-development.pdf"
            },
            {
                title: "Data Center Modernization Project",
                description: "Complete overhaul of data center infrastructure, reducing energy consumption by 35% and improving reliability",
                readTime: "14 min read",
                fileUrl: "/case-studies/data-center-modernization.pdf"
            }
        ],
        logoUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    }), []);

    // Fetch company data from backend
    const fetchCompanyData = useCallback(async () => {
        // Only fetch if we haven't initialized yet or if we don't have data or if role is null
        if (role === null || role !== "company" || (hasInitialized && companyData)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('https://proposal-form-backend.vercel.app/api/profile/getProfile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = {
                companyName: response.data.companyName,
                adminName: response.data.adminName,
                industry: response.data.industry,
                location: response.data.location,
                email: response.data.email,
                phone: response.data.phone,
                website: response.data.website,
                linkedIn: response.data.linkedIn,
                profile: {
                    bio: response.data.bio,
                    services: response.data.services,
                    awards: response.data.awards,
                    clients: response.data.clients,
                    preferredIndustries: response.data.preferredIndustries
                },
                employees: response.data.employees,
                companyDetails: {
                    "No.of employees": { value: response.data.numberOfEmployees },
                    "Founded": { value: response.data.establishedYear }
                },
                caseStudiesList: response.data.caseStudies,
                certificationsList: response.data.licensesAndCertifications,
                documentList: response.data.documents,
                stats: {
                    totalProposals: response.data.totalProposals,
                    wonProposals: response.data.wonProposals,
                    successRate: response.data.successRate,
                    activeProposals: response.data.activeProposals
                },
                proposalList: response.data.proposals,
                logoUrl_1: response.data.logoUrl ? "https://proposal-form-backend.vercel.app/api/profile/getProfileImage/file/" + response.data.logoUrl : null
            };
            setCompanyData(data);
            setHasInitialized(true);
        } catch (err) {
            setError(err.message);
            setCompanyData(getMockCompanyData());
            setHasInitialized(true);
        } finally {
            setLoading(false);
        }
    }, [role, hasInitialized, companyData, getMockCompanyData]);

    useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        companyData,
        loading,
        error,
        refreshProfile: fetchCompanyData
    }), [companyData, loading, error, fetchCompanyData]);

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    );
};
