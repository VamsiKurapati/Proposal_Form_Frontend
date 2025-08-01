import React, { useEffect, useState } from 'react';
import NavbarComponent from './NavbarComponent';
import { MdOutlineBookmark, MdOutlineBookmarkBorder, MdOutlineShare, MdOutlineCalendarMonth } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const initialProposals = {
    saved: [
        {
            _id: 'saved_001',
            userEmail: 'user@example.com',
            rfpId: 'rfp_001',
            rfp: {
                title: 'Smart City Innovation Grant',
                description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
                logo: 'https://example.com/smart-city-logo.png',
                match: 95,
                budget: '$100,000',
                deadline: 'Dec 20, 2024',
                organization: 'Smart City Initiative',
                fundingType: 'Grant',
                organizationType: 'Government',
                link: 'https://example.com/smart-city-rfp',
                type_: 'Technology'
            }
        },
        {
            _id: 'saved_002',
            userEmail: 'user@example.com',
            rfpId: 'rfp_002',
            rfp: {
                title: 'Affordable Housing Project',
                description: 'Development of affordable housing units to address community housing needs.',
                logo: 'https://example.com/housing-logo.png',
                match: 88,
                budget: '$250,000',
                deadline: 'Jan 15, 2025',
                organization: 'Housing Development Corp',
                fundingType: 'Contract',
                organizationType: 'Non-Profit',
                link: 'https://example.com/housing-rfp',
                type_: 'Construction'
            }
        },
        {
            _id: 'saved_003',
            userEmail: 'user@example.com',
            rfpId: 'rfp_003',
            rfp: {
                title: 'Healthcare Campus Planning Services',
                description: 'Comprehensive planning and design services for a new healthcare campus.',
                logo: 'https://example.com/healthcare-logo.png',
                match: 92,
                budget: '$500,000',
                deadline: 'Feb 28, 2025',
                organization: 'Regional Medical Center',
                fundingType: 'Professional Services',
                organizationType: 'Healthcare',
                link: 'https://example.com/healthcare-rfp',
                type_: 'Healthcare'
            }
        },
        {
            _id: 'saved_004',
            userEmail: 'user@example.com',
            rfpId: 'rfp_004',
            rfp: {
                title: 'Mixed-Use Development Opportunity',
                description: 'Design and development of a mixed-use commercial and residential complex.',
                logo: 'https://example.com/development-logo.png',
                match: 85,
                budget: '$750,000',
                deadline: 'Mar 10, 2025',
                organization: 'Urban Development Partners',
                fundingType: 'Contract',
                organizationType: 'Private',
                link: 'https://example.com/development-rfp',
                type_: 'Real Estate'
            }
        }
    ],
    drafts: [
        {
            _id: 'draft_001',
            userEmail: 'user@example.com',
            rfpId: 'rfp_005',
            rfp: {
                title: 'Urban Infrastructure Improvement',
                description: 'Comprehensive infrastructure upgrades for downtown area including roads, utilities, and public spaces.',
                logo: 'https://example.com/infrastructure-logo.png',
                match: 78,
                budget: '$1,200,000',
                deadline: 'Apr 5, 2025',
                organization: 'City Public Works',
                fundingType: 'Contract',
                organizationType: 'Government',
                link: 'https://example.com/infrastructure-rfp',
                type_: 'Infrastructure'
            }
        },
        {
            _id: 'draft_002',
            userEmail: 'user@example.com',
            rfpId: 'rfp_006',
            rfp: {
                title: 'Walmart Fuel Station',
                description: 'Design and construction of a new fuel station and convenience store facility.',
                logo: 'https://example.com/walmart-logo.png',
                match: 82,
                budget: '$300,000',
                deadline: 'May 20, 2025',
                organization: 'Walmart Inc.',
                fundingType: 'Contract',
                organizationType: 'Private',
                link: 'https://example.com/walmart-rfp',
                type_: 'Retail'
            }
        },
        {
            _id: 'draft_003',
            userEmail: 'user@example.com',
            rfpId: 'rfp_007',
            rfp: {
                title: 'Civic Center Redevelopment - Design and Build',
                description: 'Complete redevelopment of the city civic center including architectural design and construction.',
                logo: 'https://example.com/civic-logo.png',
                match: 90,
                budget: '$2,500,000',
                deadline: 'Jun 15, 2025',
                organization: 'City of Metropolis',
                fundingType: 'Design-Build',
                organizationType: 'Government',
                link: 'https://example.com/civic-rfp',
                type_: 'Architecture'
            }
        },
        {
            _id: 'draft_004',
            userEmail: 'user@example.com',
            rfpId: 'rfp_008',
            rfp: {
                title: 'Civil Design Services',
                description: 'Professional civil engineering services for municipal infrastructure projects.',
                logo: 'https://example.com/engineering-logo.png',
                match: 87,
                budget: '$180,000',
                deadline: 'Jul 30, 2025',
                organization: 'County Engineering Department',
                fundingType: 'Professional Services',
                organizationType: 'Government',
                link: 'https://example.com/engineering-rfp',
                type_: 'Engineering'
            }
        }
    ]
};

const ProposalCard = ({ proposal, onBookmark, onShare, onGenerate }) => (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between relative">
        <div>
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[18px] mb-1 text-[#111827]">{proposal.title}</h3>
                <div className="flex gap-2">
                    <button
                        title={proposal.bookmarked ? "Unsave" : "Save"}
                        onClick={onBookmark}
                        className="text-[#111827]"
                    >
                        {proposal.bookmarked ? (
                            <MdOutlineBookmark className="w-5 h-5" />
                        ) : (
                            <MdOutlineBookmarkBorder className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        title="Share"
                        onClick={onShare}
                        className="text-[#111827]"
                    >
                        <MdOutlineShare className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p className="text-[#4B5563] text-[16px] mb-2">{proposal.description}</p>
            <div className="flex items-center text-[14px] text-[#4B5563CC] mb-2">
                <MdOutlineCalendarMonth className="w-4 h-4 mr-1 text-[#4B5563]" />
                Deadline: {proposal.deadline}
            </div>
        </div>
        <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
                <span className="text-[#2563EB] text-[14px] font-semibold">{proposal.budget}</span>
            </div>
            <div>
                <button
                    onClick={onGenerate}
                    className="self-end bg-[#2563EB] text-white px-5 py-1.5 rounded-lg hover:bg-[#1d4ed8] text-[16px] font-medium"
                >
                    Generate
                </button>
            </div>
        </div>

    </div>
);

const Proposals = () => {
    const [savedProposals, setSavedProposals] = useState([]);
    const [draftProposals, setDraftProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProposals = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get("https://proposal-form-backend.vercel.app/api/rfp/getSavedAndDraftRFPs", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log(res.data);
                setSavedProposals(res.data.savedRFPs);
                setDraftProposals(res.data.draftRFPs);
            } catch (error) {
                console.error('Error fetching proposals:', error);
                setSavedProposals(initialProposals.saved);
                setDraftProposals(initialProposals.drafts);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProposals();
    }, []);

    const handleSave = async (rfp) => {
        try {
            const res = await axios.post("https://proposal-form-backend.vercel.app/api/rfp/saveRFP", { rfpId: rfp._id, rfp: rfp }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 201 || res.status === 200) {
                setSavedProposals((prev) => [...prev, rfp]);
                console.log("RFP data:", rfp);
            }
            return;
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnsave = async (rfpId) => {
        try {
            console.log("sending request...");
            const res = await axios.post("https://proposal-form-backend.vercel.app/api/rfp/unsaveRFP", { rfpId: rfpId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 200) {
                console.log("Handling Unsave...");
                setSavedProposals((prev) => prev.filter((r) => r._id !== rfpId));
            }
            return;
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = (link) => {
        navigator.clipboard.writeText(link).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    const handleGenerate = (proposal) => {
        navigate('/proposal_page', { state: { proposal } });
    };

    const isSaved = (rfpId) => {
        return savedProposals.some((rfp) => rfp.rfpId === rfpId);
    };

    return (
        <>
            <div>
                <NavbarComponent />
            </div>
            <div className="w-full mx-auto mt-16 px-8 py-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-[24px] font-semibold mb-2">Saved Proposals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                            {savedProposals.length > 0 ? savedProposals.map((proposal, idx) => (
                                <ProposalCard
                                    key={proposal._id}
                                    proposal={{
                                        proposal,
                                        bookmarked: true
                                    }}
                                    onBookmark={() => handleUnsave(proposal._id)}
                                    onShare={() => handleShare(proposal.link)}
                                    onGenerate={() => handleGenerate(proposal)}
                                />
                            )) : <div className="col-span-2 text-center text-[#4B5563] py-8">
                                No saved proposals yet
                            </div>}
                        </div>
                        <h2 className="text-[24px] font-semibold mb-2">Drafts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {draftProposals.length > 0 ? draftProposals.map((proposal, idx) => (
                                <ProposalCard
                                    key={proposal._id}
                                    proposal={{
                                        proposal,
                                        bookmarked: false
                                    }}
                                    onBookmark={() => isSaved(proposal._id) ? handleUnsave(proposal._id) : handleSave(proposal)}
                                    onShare={() => handleShare(proposal.link)}
                                    onGenerate={() => handleGenerate(proposal)}
                                />
                            )) : <div className="col-span-2 text-center text-[#4B5563] py-8">
                                No draft proposals yet
                            </div>}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Proposals;
