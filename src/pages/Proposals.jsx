import React, { useEffect, useState, useCallback, useMemo } from 'react';
import NavbarComponent from './NavbarComponent';
import { MdOutlineBookmark, MdOutlineBookmarkBorder, MdOutlineShare, MdOutlineCalendarMonth, MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Constants
const API_BASE_URL = "https://proposal-form-backend.vercel.app/api";
const API_ENDPOINTS = {
    GET_SAVED_AND_DRAFT_RFPS: `${API_BASE_URL}/rfp/getSavedAndDraftRFPs`,
    SAVE_RFP: `${API_BASE_URL}/rfp/saveRFP`,
    UNSAVE_RFP: `${API_BASE_URL}/rfp/unsaveRFP`,
};

const ProposalCard = ({ proposal_info, onBookmark, onShare, onGenerate, userRole, buttonText = "Generate", isCurrentEditor = true, isLoading = false }) => (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between relative">
        <div>
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[18px] mb-1 text-[#111827]">{proposal_info.title}</h3>
                <div className="flex gap-2">
                    <button
                        title={proposal_info.bookmarked ? (userRole === "Viewer" ? "Viewer cannot unsave" : "Unsave") : "Save"}
                        onClick={proposal_info.bookmarked && userRole === "Viewer" ? undefined : onBookmark}
                        disabled={isLoading || (proposal_info.bookmarked && userRole === "Viewer")}
                        aria-label={proposal_info.bookmarked ? (userRole === "Viewer" ? "Viewer cannot unsave" : "Unsave proposal") : "Save proposal"}
                        className={`${proposal_info.bookmarked && userRole === "Viewer" ? "cursor-not-allowed opacity-50" : isLoading ? "cursor-wait opacity-75" : "cursor-pointer"} text-[#111827]`}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#111827]" aria-hidden="true"></div>
                        ) : proposal_info.bookmarked ? (
                            <MdOutlineBookmark className="w-5 h-5" />
                        ) : (
                            <MdOutlineBookmarkBorder className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        title="Share"
                        onClick={onShare}
                        aria-label="Share proposal"
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
                    disabled={userRole === "Viewer" || (buttonText === "Continue" && !isCurrentEditor)}
                    aria-label={`${buttonText.toLowerCase()} proposal`}
                    className={`self-end px-5 py-1.5 rounded-lg text-[16px] font-medium ${userRole === "Viewer" || (buttonText === "Continue" && !isCurrentEditor)
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                        }`}
                    title={
                        userRole === "Viewer"
                            ? "Viewer cannot generate/edit proposals"
                            : buttonText === "Continue" && !isCurrentEditor
                                ? "Only the current editor can continue this proposal"
                                : `Click to ${buttonText.toLowerCase()}`
                    }
                >
                    {buttonText}
                </button>
                {buttonText === "Continue" && !isCurrentEditor && (
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        Current editor: {proposal_info.currentEditor?.fullName || proposal_info.currentEditor?.email || 'Unknown'}
                    </div>
                )}
            </div>
        </div>

    </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const earlyPageThreshold = 3;
        const latePageThreshold = 2;
        const pageRangeSize = 4;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= earlyPageThreshold) {
                for (let i = 1; i <= pageRangeSize; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - latePageThreshold) {
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
                aria-label="Go to previous page"
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
                    aria-label={page === '...' ? 'Page separator' : `Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
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
                aria-label="Go to next page"
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
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [fetchedProposals, setFetchedProposals] = useState(false);
    const [savingStates, setSavingStates] = useState({}); // Track saving state for each proposal
    const navigate = useNavigate();

    // Calculate items per page based on screen size
    const calculateItemsPerPage = useCallback(() => {
        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 768) return 2;
        return 4;
    }, []);

    // Get grid layout class based on items per page
    const getGridLayoutClass = () => {
        if (itemsPerPage === 1) return "grid-cols-1";
        if (itemsPerPage === 2) return "grid-cols-1 md:grid-cols-2";
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    };

    // Calculate pagination for saved proposals
    const savedProposalsStartIndex = (currentSavedPage - 1) * itemsPerPage;
    const savedProposalsEndIndex = Math.min(savedProposalsStartIndex + itemsPerPage, savedProposals.length);
    const currentSavedProposals = savedProposals.slice(savedProposalsStartIndex, savedProposalsEndIndex);
    const totalSavedPages = Math.max(1, Math.ceil(savedProposals.length / itemsPerPage));

    // Calculate pagination for draft proposals
    const draftProposalsStartIndex = (currentDraftPage - 1) * itemsPerPage;
    const draftProposalsEndIndex = Math.min(draftProposalsStartIndex + itemsPerPage, draftProposals.length);
    const currentDraftProposals = draftProposals.slice(draftProposalsStartIndex, draftProposalsEndIndex);
    const totalDraftPages = Math.max(1, Math.ceil(draftProposals.length / itemsPerPage));

    // Validate that we're not showing more items than expected
    const validatePagination = () => {
        if (currentSavedProposals.length > itemsPerPage) {
            console.warn('Saved proposals showing more items than expected:', currentSavedProposals.length, 'expected:', itemsPerPage);
        }
        if (currentDraftProposals.length > itemsPerPage) {
            console.warn('Draft proposals showing more items than expected:', currentDraftProposals.length, 'expected:', itemsPerPage);
        }
    };

    // Run validation on every render
    useEffect(() => {
        validatePagination();
    }, []); // Add empty dependency array to run only once

    // Ensure current page doesn't exceed total pages
    useEffect(() => {
        if (currentSavedPage > totalSavedPages && totalSavedPages > 0) {
            setCurrentSavedPage(totalSavedPages);
        }
        if (currentDraftPage > totalDraftPages && totalDraftPages > 0) {
            setCurrentDraftPage(totalDraftPages);
        }
    }, [currentSavedPage, currentDraftPage, totalSavedPages, totalDraftPages]);

    // Debug logging for pagination (only in development)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Pagination Debug:', {
                itemsPerPage,
                currentSavedPage,
                currentDraftPage,
                savedProposalsLength: savedProposals.length,
                draftProposalsLength: draftProposals.length,
                currentSavedProposalsLength: currentSavedProposals.length,
                currentDraftProposalsLength: currentDraftProposals.length,
                totalSavedPages,
                totalDraftPages,
                savedProposalsStartIndex,
                savedProposalsEndIndex,
                draftProposalsStartIndex,
                draftProposalsEndIndex
            });
        }
    }, [itemsPerPage, currentSavedPage, currentDraftPage, savedProposals.length, draftProposals.length, currentSavedProposals.length, currentDraftProposals.length, totalSavedPages, totalDraftPages, savedProposalsStartIndex, savedProposalsEndIndex, draftProposalsStartIndex, draftProposalsEndIndex]);

    const { role } = useUser();

    // Get user email from localStorage with memoization
    const userEmail = useMemo(() => {
        try {
            // Try to get email from userEmail key first
            const directEmail = localStorage.getItem("userEmail");
            if (directEmail && typeof directEmail === 'string' && directEmail.includes('@')) {
                return directEmail;
            }

            // Fallback to parsing user object
            const user = localStorage.getItem("user");
            if (user && typeof user === 'string') {
                const parsed = JSON.parse(user);
                if (parsed && typeof parsed === 'object' && parsed.email && typeof parsed.email === 'string' && parsed.email.includes('@')) {
                    return parsed.email;
                }
            }
            return null;
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error parsing user from localStorage:', error);
            }
            return null;
        }
    }, []); // Empty dependency array since localStorage doesn't change during component lifecycle

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const newItemsPerPage = calculateItemsPerPage();
            if (newItemsPerPage !== itemsPerPage) {
                setItemsPerPage(newItemsPerPage);
                // Reset to first page when items per page changes
                setCurrentSavedPage(1);
                setCurrentDraftPage(1);
            }
        };

        // Set initial items per page
        setItemsPerPage(calculateItemsPerPage());

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateItemsPerPage]); // Remove itemsPerPage from dependencies

    const fetchProposals = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_ENDPOINTS.GET_SAVED_AND_DRAFT_RFPS, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (process.env.NODE_ENV === 'development') {
                console.log("res.data", res.data);
            }
            setSavedProposals(res.data.savedRFPs || []);
            setDraftProposals(res.data.draftRFPs || []);

            // Reset pagination to first page when new data is fetched
            setCurrentSavedPage(1);
            setCurrentDraftPage(1);

            if (process.env.NODE_ENV === 'development') {
                console.log("savedProposals", res.data.savedRFPs);
                console.log("draftProposals", res.data.draftRFPs);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching proposals:', error);
            }

            // More specific error messages based on error type
            let errorMessage = "Error fetching proposals";
            if (error.response?.status === 401) {
                errorMessage = "Authentication failed. Please log in again.";
            } else if (error.response?.status === 403) {
                errorMessage = "Access denied. You don't have permission to view proposals.";
            } else if (error.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (!navigator.onLine) {
                errorMessage = "No internet connection. Please check your network.";
            }

            alert(errorMessage);

            // Reset to empty arrays on error
            setSavedProposals([]);
            setDraftProposals([]);
            setCurrentSavedPage(1);
            setCurrentDraftPage(1);
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

    const handleSave = async (rfp) => {
        const proposalId = rfp._id;
        setSavingStates(prev => ({ ...prev, [proposalId]: true }));

        try {
            const res = await axios.post(API_ENDPOINTS.SAVE_RFP, { rfpId: rfp._id, rfp: rfp }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 201 || res.status === 200) {
                setSavedProposals((prev) => [...prev, rfp]);
                if (process.env.NODE_ENV === 'development') {
                    console.log("RFP data:", rfp);
                }
            }
        } catch (err) {
            console.error('Error saving RFP:', err);
            alert('Failed to save RFP');
        } finally {
            setSavingStates(prev => ({ ...prev, [proposalId]: false }));
        }
    };

    const handleUnsave = async (rfpId) => {
        setSavingStates(prev => ({ ...prev, [rfpId]: true }));

        try {
            if (process.env.NODE_ENV === 'development') {
                console.log("sending request...");
            }
            const res = await axios.post(API_ENDPOINTS.UNSAVE_RFP, { rfpId: rfpId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 200) {
                if (process.env.NODE_ENV === 'development') {
                    console.log("Handling Unsave...");
                }
                setSavedProposals((prev) => prev.filter((r) => r._id !== rfpId));
            }
        } catch (err) {
            console.error('Error unsaving RFP:', err);
            alert('Failed to unsave RFP');
        } finally {
            setSavingStates(prev => ({ ...prev, [rfpId]: false }));
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

    const handleContinue = (proposal) => {
        console.log("proposal", proposal);
        console.log("proposal.generatedProposal", proposal.generatedProposal);
        navigate('/editor', { state: { proposal: proposal.generatedProposal || null } });
    };

    const isSaved = (rfpId) => {
        return savedProposals.some((rfp) => rfp.rfpId === rfpId);
    };

    const handleSavedPageChange = (page) => {
        if (page >= 1 && page <= totalSavedPages) {
            setCurrentSavedPage(page);
        }
    };

    const handleDraftPageChange = (page) => {
        if (page >= 1 && page <= totalDraftPages) {
            setCurrentDraftPage(page);
        }
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
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-600">
                                Showing {savedProposals.length > 0 ? savedProposalsStartIndex + 1 : 0} to {Math.min(savedProposalsEndIndex, savedProposals.length)} of {savedProposals.length} proposals
                            </span>
                        </div>
                        <div className={`grid ${getGridLayoutClass()} gap-5 mb-6`}>
                            {currentSavedProposals.length > 0 ? (
                                <>
                                    {currentSavedProposals.length > itemsPerPage && (
                                        <div className="col-span-full text-red-500 text-sm mb-2">
                                            Warning: Showing {currentSavedProposals.length} items (expected max: {itemsPerPage})
                                        </div>
                                    )}
                                    {currentSavedProposals.map((proposal, idx) => (
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
                                            buttonText="Generate"
                                            isCurrentEditor={true}
                                            isLoading={savingStates[proposal._id] || false}
                                        />
                                    ))}
                                </>
                            ) : <div className="col-span-full text-center text-[#4B5563] py-8">
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
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-600">
                                Showing {draftProposals.length > 0 ? draftProposalsStartIndex + 1 : 0} to {Math.min(draftProposalsEndIndex, draftProposals.length)} of {draftProposals.length} proposals
                            </span>
                        </div>
                        <div className={`grid ${getGridLayoutClass()} gap-5 mb-6`}>
                            {currentDraftProposals.length > 0 ? (
                                <>
                                    {currentDraftProposals.length > itemsPerPage && (
                                        <div className="col-span-full text-red-500 text-sm mb-2">
                                            Warning: Showing {currentDraftProposals.length} items (expected max: {itemsPerPage})
                                        </div>
                                    )}
                                    {currentDraftProposals.map((proposal, idx) => {
                                        // Debug logging only in development
                                        if (process.env.NODE_ENV === 'development') {
                                            console.log('Draft Proposal Debug:', {
                                                proposalId: proposal._id,
                                                currentEditor: proposal.currentEditor,
                                                userEmail: userEmail,
                                                isCurrentEditor: proposal.currentEditor?.email === userEmail,
                                                fullProposal: proposal
                                            });
                                        }
                                        return (
                                            <ProposalCard
                                                key={proposal._id}
                                                proposal_info={{
                                                    ...proposal,
                                                    bookmarked: false
                                                }}
                                                onBookmark={() => isSaved(proposal._id) ? handleUnsave(proposal._id) : handleSave(proposal)}
                                                onShare={() => handleShare(proposal.link)}
                                                onGenerate={() => handleContinue(proposal)}
                                                userRole={role}
                                                buttonText="Continue"
                                                isCurrentEditor={proposal.currentEditor?.email === userEmail}
                                                isLoading={savingStates[proposal._id] || false}
                                            />
                                        );
                                    })}
                                </>
                            ) : <div className="col-span-full text-center text-[#4B5563] py-8">
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
