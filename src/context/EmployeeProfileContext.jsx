import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const EmployeeProfileContext = createContext();

export const useEmployeeProfile = () => useContext(EmployeeProfileContext);

export const EmployeeProfileProvider = ({ children }) => {
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [proposalsInProgress, setProposalsInProgress] = useState([]);
    const [completedProposals, setCompletedProposals] = useState([]);

    // Mock data fallback (copy from CompanyProfileDashboard)
    const getMockEmployeeData = useCallback(() => ({
        name: "John Doe",
        jobTitle: "Software Development Engineer (SDE) II",
        accessLevel: "Editor",
        companyName: "ABC Company Inc.",
        location: "San Francisco, CA",
        email: "myname@email.com",
        phone: "+91-5877486484",
        highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
        skills: ["JavaScript", "React", "Node.js"],
        logoUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    }), []);

    const getMockProposals = useCallback(() => ({
        proposals: [
            {
                id: 1,
                title: "Data Analytics Proposal",
                status: "In Progress",
                clientName: "ABC Company Inc.",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },

            {
                id: 2,
                title: "Data Analytics Proposal 2",
                status: "Submitted",
                clientName: "ABC Company Inc.",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },

            {
                id: 3,
                title: "Data Analytics Proposal 3",
                status: "Rejected",
                clientName: "ABC Company Inc.",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },

            {
                id: 4,
                title: "Data Analytics Proposal 4",
                status: "Completed",
                clientName: "ABC Company Inc.",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },

            {
                id: 5,
                title: "Data Analytics Proposal 5",
                status: "Completed",
                clientName: "ABC Company Inc. 2",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },

            {
                id: 6,
                title: "Data Analytics Proposal 6",
                status: "Completed",
                clientName: "ABC Company Inc. 3",
                deadline: "2025-01-01",
                location: "San Francisco, CA",
                email: "myname@email.com",
                phone: "+91-5877486484",
                highestQualification: "Bachelor of Technology (B.Tech) in Computer Science",
                skills: ["JavaScript", "React", "Node.js"],
            },
        ]
    }), []);

    const fetchProposals = useCallback(async () => {
        try {
            const res = await axios.get('https://proposal-form-backend.vercel.app/api/profile/getProposals', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = res.data;

            const proposalsInProgress = data.filter(proposal => proposal.status === "In Progress");
            const completedProposals = data.filter(proposal => proposal.status !== "In Progress");
            setProposalsInProgress(proposalsInProgress);
            setCompletedProposals(completedProposals);
        } catch (err) {
            setError(err.message);
            const proposals = getMockProposals().proposals;
            const proposalsInProgress = proposals.filter(proposal => proposal.status === "In Progress");
            const completedProposals = proposals.filter(proposal => proposal.status !== "In Progress");
            setProposalsInProgress(proposalsInProgress);
            setCompletedProposals(completedProposals);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    const refreshProposals = fetchProposals;

    // Fetch company data from backend
    const fetchEmployeeData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('https://proposal-form-backend.vercel.app/api/profile/getEmployeeProfile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = {
                name: response.data.name,
                jobTitle: response.data.jobTitle,
                accessLevel: response.data.accessLevel,
                companyName: response.data.companyName,
                location: response.data.location,
                highestQualification: response.data.highestQualification,
                skills: response.data.skills,
                email: response.data.email,
                phone: response.data.phone,
                logoUrl_1: response.data.logoUrl ? "https://proposal-form-backend.vercel.app/api/profile/getProfileImage/file/" + response.data.logoUrl : null
            };
            setEmployeeData(data);
        } catch (err) {
            setError(err.message);
            setEmployeeData(getMockEmployeeData());
        } finally {
            setLoading(false);
        }
    }, [getMockEmployeeData]);

    useEffect(() => {
        fetchEmployeeData();
    }, [fetchEmployeeData]);

    const refreshEmployeeProfile = fetchEmployeeData;

    return (
        <EmployeeProfileContext.Provider value={{ employeeData, loading, error, refreshEmployeeProfile, proposalsInProgress, completedProposals, refreshProposals }}>
            {children}
        </EmployeeProfileContext.Provider>
    );
};