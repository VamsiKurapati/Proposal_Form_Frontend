import React, { useEffect, useState } from 'react';
import NavbarComponent from './NavbarComponent';
import { MdOutlineBookmark, MdOutlineBookmarkBorder, MdOutlineShare, MdOutlineCalendarMonth, MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProposalCard = ({ proposal_info, onBookmark, onShare, onGenerate, userRole }) => (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between relative">
        <div>
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[18px] mb-1 text-[#111827]">{proposal_info.title}</h3>
                <div className="flex gap-2">
                    <button
                        title={proposal_info.bookmarked ? (userRole === "Viewer" ? "Viewer cannot unsave" : "Unsave") : "Save"}
                        onClick={proposal_info.bookmarked && userRole === "Viewer" ? undefined : onBookmark}
                        className={`${proposal_info.bookmarked && userRole === "Viewer" ? "cursor-not-allowed opacity-50" : "cursor-pointer"} text-[#111827]`}
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                    }`}
            >
                <MdOutlineChevronLeft className="w-4 h-4" />
                Previous
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${page === '...'
                        ? 'text-gray-400 cursor-default'
                        : page === currentPage
                            ? 'bg-[#2563EB] text-white'
                            : 'text-[#6B7280] hover:bg-gray-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                    }`}
            >
                Next
                <MdOutlineChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

const Proposals = () => {
    const [savedProposals, setSavedProposals] = useState([]);
    const [draftProposals, setDraftProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSavedPage, setCurrentSavedPage] = useState(1);
    const [currentDraftPage, setCurrentDraftPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 640 ? 1 : (window.innerWidth < 768 ? 2 : 4));
    const [fetchedProposals, setFetchedProposals] = useState(false);
    const navigate = useNavigate();

    // Calculate pagination for saved proposals
    const savedProposalsStartIndex = (currentSavedPage - 1) * itemsPerPage;
    const savedProposalsEndIndex = savedProposalsStartIndex + itemsPerPage;
    const currentSavedProposals = savedProposals.slice(savedProposalsStartIndex, savedProposalsEndIndex);
    const totalSavedPages = Math.ceil(savedProposals.length / itemsPerPage);

    // Calculate pagination for draft proposals
    const draftProposalsStartIndex = (currentDraftPage - 1) * itemsPerPage;
    const draftProposalsEndIndex = draftProposalsStartIndex + itemsPerPage;
    const currentDraftProposals = draftProposals.slice(draftProposalsStartIndex, draftProposalsEndIndex);
    const totalDraftPages = Math.ceil(draftProposals.length / itemsPerPage);

    const { role } = useUser();

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

    useEffect(() => {
        if (!fetchedProposals) {
            fetchProposals();
            setFetchedProposals(true);
        }
    }, [fetchedProposals]);

    useEffect(() => {
        setItemsPerPage(window.innerWidth < 640 ? 1 : (window.innerWidth < 768 ? 2 : 4));
    }, [window.innerWidth]);

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

    const handleSavedPageChange = (page) => {
        setCurrentSavedPage(page);
    };

    const handleDraftPageChange = (page) => {
        setCurrentDraftPage(page);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            {currentSavedProposals.length > 0 ? currentSavedProposals.map((proposal, idx) => (
                                <ProposalCard
                                    key={proposal._id}
                                    proposal_info={{
                                        ...proposal,
                                        bookmarked: true
                                    }}
                                    onBookmark={() => handleUnsave(proposal._id)}
                                    onShare={() => handleShare(proposal.link)}
                                    onGenerate={() => handleGenerate(proposal)}
                                    userRole={role}
                                />
                            )) : <div className="col-span-2 text-center text-[#4B5563] py-8">
                                No saved proposals yet
                            </div>}
                        </div>

                        {totalSavedPages > 1 && (
                            <Pagination
                                currentPage={currentSavedPage}
                                totalPages={totalSavedPages}
                                onPageChange={handleSavedPageChange}
                            />
                        )}

                        <h2 className="text-[24px] font-semibold mb-2 mt-10">Draft Proposals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            {currentDraftProposals.length > 0 ? currentDraftProposals.map((proposal, idx) => (
                                <ProposalCard
                                    key={proposal._id}
                                    proposal_info={{
                                        ...proposal,
                                        bookmarked: false
                                    }}
                                    onBookmark={() => isSaved(proposal._id) ? handleUnsave(proposal._id) : handleSave(proposal)}
                                    onShare={() => handleShare(proposal.link)}
                                    onGenerate={() => handleGenerate(proposal)}
                                    userRole={role}
                                />
                            )) : <div className="col-span-2 text-center text-[#4B5563] py-8">
                                No draft proposals yet
                            </div>}
                        </div>

                        {totalDraftPages > 1 && (
                            <Pagination
                                currentPage={currentDraftPage}
                                totalPages={totalDraftPages}
                                onPageChange={handleDraftPageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Proposals;
