import React, { useEffect, useState } from 'react';
import NavbarComponent from './NavbarComponent';

const initialProposals = {
    saved: [
        {
            id: '150364',
            title: 'Smart City Innovation Grant',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: true,
        },
        {
            id: '150364',
            title: 'Affordable Housing Project',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: true,
        },
        {
            id: '150364',
            title: 'Healthcare Campus Planning Services',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: true,
        },
        {
            id: '150364',
            title: 'Mixed-Use Development Opportunity',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: true,
        },
    ],
    drafts: [
        {
            id: '150364',
            title: 'Urban Infrastructure Improvement',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: false,
        },
        {
            id: '150364',
            title: 'Walmart Fuel Station',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: false,
        },
        {
            id: '150364',
            title: 'Civic Center Redevelopment - Design and Build',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: false,
        },
        {
            id: '150364',
            title: 'Civil Design Services',
            description: 'Support for innovative smart city solutions that improve urban infrastructure and sustainability.',
            deadline: 'Dec 20, 2024',
            bookmarked: false,
        },
    ],
};

const ProposalCard = ({ proposal, onBookmark, onShare, onGenerate }) => (
    <div className="bg-white rounded-xl shadow border p-5 flex flex-col justify-between min-h-[170px] relative">
        <div>
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[16px] mb-1">{proposal.title}</h3>
                <div className="flex gap-2">
                    <button
                        title="Bookmark"
                        onClick={onBookmark}
                        className="text-gray-400 hover:text-blue-600"
                    >
                        {proposal.bookmarked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path d="M5 3a2 2 0 0 0-2 2v13l7-4 7 4V5a2 2 0 0 0-2-2H5z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 0 0-2 2v13l7-4 7 4V5a2 2 0 0 0-2-2H5z" /></svg>
                        )}
                    </button>
                    <button
                        title="Share"
                        onClick={onShare}
                        className="text-gray-400 hover:text-blue-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 1 0-6 0v8a3 3 0 1 0 6 0V8z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 0l-4 4m4-4l4 4" /></svg>
                    </button>
                </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{proposal.description}</p>
            <div className="flex items-center text-xs text-gray-500 mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></svg>
                Deadline: {proposal.deadline}
            </div>
            <a href="#" className="text-blue-600 text-xs font-medium hover:underline">${proposal.id}</a>
        </div>
        <button
            onClick={onGenerate}
            className="mt-4 self-end bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
            Generate
        </button>
    </div>
);

const Proposals = () => {
    const [proposals, setProposals] = useState(initialProposals);
    const [shareMsg, setShareMsg] = useState('');

    // Simulate fetching from backend
    useEffect(() => {
        const fetchProposals = async () => {
            // Simulate delay
            setTimeout(() => {
                // Here you would fetch from backend and setProposals
                // For now, just keep the hardcoded proposals
            }, 1000);
        };
        fetchProposals();
    }, []);

    const handleBookmark = (section, idx) => {
        setProposals(prev => {
            const updated = { ...prev };
            updated[section] = updated[section].map((p, i) =>
                i === idx ? { ...p, bookmarked: !p.bookmarked } : p
            );
            return updated;
        });
    };

    const handleShare = (id) => {
        navigator.clipboard.writeText(id);
        setShareMsg('Proposal ID copied!');
        setTimeout(() => setShareMsg(''), 1500);
    };

    const handleGenerate = (title) => {
        alert(`Generating proposal: ${title}`);
    };

    return (
        <>
            <div>
                <NavbarComponent />
            </div>
            <div className="w-full mx-auto mt-16 px-4 md:px-8 py-8">
                <h2 className="text-xl font-semibold mb-6">Saved Proposals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    {proposals.saved.map((proposal, idx) => (
                        <ProposalCard
                            key={proposal.title}
                            proposal={proposal}
                            onBookmark={() => handleBookmark('saved', idx)}
                            onShare={() => handleShare(proposal.id)}
                            onGenerate={() => handleGenerate(proposal.title)}
                        />
                    ))}
                </div>
                <h2 className="text-xl font-semibold mb-6">Drafts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {proposals.drafts.map((proposal, idx) => (
                        <ProposalCard
                            key={proposal.title}
                            proposal={proposal}
                            onBookmark={() => handleBookmark('drafts', idx)}
                            onShare={() => handleShare(proposal.id)}
                            onGenerate={() => handleGenerate(proposal.title)}
                        />
                    ))}
                </div>
                {shareMsg && (
                    <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-all">{shareMsg}</div>
                )}
            </div>
        </>
    );
};

export default Proposals;
