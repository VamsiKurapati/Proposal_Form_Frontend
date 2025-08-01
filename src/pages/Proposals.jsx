import React, { useEffect, useState } from 'react';
import NavbarComponent from './NavbarComponent';
import { MdOutlineBookmark, MdOutlineBookmarkBorder, MdOutlineShare, MdOutlineCalendarMonth } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProposalCard = ({ proposal_info, onBookmark, onShare, onGenerate }) => (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between relative">
        <div>
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[18px] mb-1 text-[#111827]">{proposal_info.title}</h3>
                <div className="flex gap-2">
                    <button
                        title={proposal_info.bookmarked ? "Unsave" : "Save"}
                        onClick={onBookmark}
                        className="text-[#111827]"
                    >
                        {proposal_info.bookmarked ? (
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
            <p className="text-[#4B5563] text-[16px] mb-2">{proposal_info.description}</p>
            <div className="flex items-center text-[14px] text-[#4B5563CC] mb-2">
                <MdOutlineCalendarMonth className="w-4 h-4 mr-1 text-[#4B5563]" />
                Deadline: {proposal_info.deadline}
            </div>
        </div>
        <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
                <span className="text-[#2563EB] text-[14px] font-semibold">{proposal_info.budget}</span>
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
                console.log("res.data", res.data);
                setSavedProposals(res.data.savedRFPs);
                setDraftProposals(res.data.draftRFPs);
                console.log("savedProposals", savedProposals);
                console.log("draftProposals", draftProposals);
                console.log("res.data.savedRFPs", res.data.savedRFPs);
                console.log("res.data.draftRFPs", res.data.draftRFPs);
            } catch (error) {
                console.error('Error fetching proposals:', error);
                alert("Error fetching proposals");
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
                                    proposal_info={{
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
                                    proposal_info={{
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
