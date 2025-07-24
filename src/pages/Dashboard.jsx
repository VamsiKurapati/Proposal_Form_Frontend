import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdOutlineEdit, MdOutlineSearch, MdOutlineVisibility, MdOutlineRotateLeft, MdOutlineDeleteForever, MdPersonAddAlt1 } from "react-icons/md";
import { useProfile } from '../context/ProfileContext';

const localizer = momentLocalizer(moment);

const summaryStats = [
    { label: 'All Proposals', value: 120 },
    { label: 'In Progress', value: 45 },
    { label: 'Submitted', value: 62 },
    { label: 'Won', value: 10 },
];

const proposals = [
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'In Progress',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'Submitted',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'Won',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'Rejected',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'In Progress',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
    {
        name: 'Research in Artificial Intelligence',
        client: 'Government Agency',
        deadline: 'Mar 15, 2024',
        status: 'Won',
        editor: 'John Doe',
        submission: 'Mar 15, 2024',
    },
];

const statusStyles = {
    "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
    "Won": "bg-[#FEF9C3] text-[#CA8A04]",
    "Submitted": "bg-[#DCFCE7] text-[#15803D]",
    "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
};

const statsStyles = {
    "All Proposals": "bg-[#EFF6FF] text-[#2563EB]",
    "In Progress": "bg-[#EEF2FF] text-[#4F46E5]",
    "Submitted": "bg-[#F0FDF4] text-[#16A34A]",
    "Won": "bg-[#FEFCE8] text-[#CA8A04]",
}

const calendarEvents = [
    {
        title: 'Sustainable Office Park Development',
        start: new Date(2025, 7, 1),
        end: new Date(2025, 7, 1),
        status: 'Submitted',
    },
    {
        title: 'High-Tech Campus Expansion',
        start: new Date(2025, 7, 6),
        end: new Date(2025, 7, 6),
        status: 'In Progress',
    },
    {
        title: 'Affordable Housing Project',
        start: new Date(2025, 7, 8),
        end: new Date(2025, 7, 8),
        status: 'Won',
    },
    {
        title: 'Educational Facility Modernization - Design-Build',
        start: new Date(2025, 7, 14),
        end: new Date(2025, 7, 14),
        status: 'Rejected',
    },
    {
        title: 'Urban Infrastructure Improvement',
        start: new Date(2025, 7, 23),
        end: new Date(2025, 7, 23),
        status: 'Submitted',
    },
    {
        title: 'Historic Landmark Restoration',
        start: new Date(2025, 7, 29),
        end: new Date(2025, 7, 29),
        status: 'Won',
    },
    {
        title: 'Walmart Fuel Station',
        start: new Date(2025, 7, 4),
        end: new Date(2025, 7, 4),
        status: 'Deadline',
    },
    {
        title: 'Smart City Technology Integration',
        start: new Date(2025, 7, 18),
        end: new Date(2025, 7, 18),
        status: 'Rejected',
    },
    {
        title: 'Mixed-Use Development Opportunity',
        start: new Date(2025, 7, 20),
        end: new Date(2025, 7, 20),
        status: 'Won',
    },
    {
        title: 'Civil Design Services',
        start: new Date(2025, 7, 26),
        end: new Date(2025, 7, 26),
        status: 'Deadline',
    },
];

const deletedProposals = [
    {
        name: 'Healthcare Campus Planning Services',
        client: 'Lumens Auto Pte Ltd',
        deadline: 'Mar 15, 2024',
        status: 'Rejected',
        restore: '4 days',
    },
    {
        name: 'Educational Facility Modernization...',
        client: 'Worthing Brothers Crane',
        deadline: 'Mar 15, 2024',
        status: 'Submitted',
        restore: '6 days',
    },
    {
        name: 'Walmart Fuel Station',
        client: 'Tower Inc',
        deadline: 'Mar 15, 2024',
        status: 'Rejected',
        restore: '1 day',
    },
    {
        name: 'Mixed-Use Development Opportunity',
        client: 'ABC Crane',
        deadline: 'Mar 15, 2024',
        status: 'Rejected',
        restore: '3 days',
    },
];

function statusBadge(status) {
    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}

const PAGE_SIZE = 5;

const Dashboard = () => {
    const { companyData } = useProfile();
    const userName = 'John Doe';
    const [search, setSearch] = useState('');
    const [proposalsState, setProposalsState] = useState(proposals);
    const [showAddPersonIdx, setShowAddPersonIdx] = useState(null);
    const [selectedProposals, setSelectedProposals] = useState([]);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [currentProposalPage, setCurrentProposalPage] = useState(1);
    const [currentDeletedPage, setCurrentDeletedPage] = useState(1);
    const [calendarMonth, setCalendarMonth] = useState(moment().month());
    const [calendarYear, setCalendarYear] = useState(moment().year());

    const employees = (companyData && companyData?.employees) || [
        { name: 'John Doe' },
        { name: 'Sara Johnson' },
        { name: 'Darrell Steward' },
        { name: 'Cody Fisher' },
        { name: 'Eleanor Pena' },
        { name: 'Theresa Webb' },
        { name: 'Bessie Cooper' },
        { name: 'Jane Cooper' },
        { name: 'Leslie Alexander' },
        { name: 'Ralph Edwards' },
        { name: 'Devon Lane' },
    ];

    // console.log

    const handleEditorChange = (idx, newEditor) => {
        setProposalsState(prev => prev.map((p, i) => i === idx ? { ...p, editor: newEditor } : p));
        setShowAddPersonIdx(null);
    };

    const handleSelectProposal = (idx) => {
        setSelectedProposals(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const handleDeleteProposals = () => {
        setProposalsState(prev => prev.filter((_, idx) => !selectedProposals.includes(idx)));
        setSelectedProposals([]);
        setShowDeleteOptions(false);
    };

    // Pagination logic for proposals
    const filteredProposals = proposalsState.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const totalProposalPages = Math.ceil(filteredProposals.length / PAGE_SIZE);
    const paginatedProposals = filteredProposals.slice((currentProposalPage - 1) * PAGE_SIZE, currentProposalPage * PAGE_SIZE);

    // Pagination logic for deleted proposals
    const totalDeletedPages = Math.ceil(deletedProposals.length / PAGE_SIZE);
    const paginatedDeletedProposals = deletedProposals.slice((currentDeletedPage - 1) * PAGE_SIZE, currentDeletedPage * PAGE_SIZE);

    // Helper: get all years in a reasonable range
    const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);
    const monthOptions = moment.months();

    // Helper: get events for a specific date
    function getEventsForDate(date) {
        return calendarEvents.filter(ev =>
            moment(ev.start).isSame(date, 'day')
        );
    }

    // Helper: bg color map for calendar
    const bgColor = {
        'In Progress': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(14, 45, 85, 0.1))',
        'Submitted': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(220,252,231,0.1))',
        'Won': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(254,249,195,0.1))',
        'Rejected': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(254,226,226,0.1))',
        'Deadline': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(254,226,226,0.1))',
    }

    // Helper: status color map for bg and text, dot
    const statusBgMap = {
        'In Progress': 'bg-[#DBEAFE] text-[#2563EB]',
        'Submitted': 'bg-[#DCFCE7] text-[#16A34A]',
        'Won': 'bg-[#FEF9C3] text-[#CA8A04]',
        'Rejected': 'bg-[#FEE2E2] text-[#DC2626]',
        'Deadline': 'bg-[#FEF3C7] text-[#F59E42]',
    };

    const statusDotMap = {
        'In Progress': 'bg-[#2563EB]',
        'Submitted': 'bg-[#16A34A]',
        'Won': 'bg-[#CA8A04]',
        'Rejected': 'bg-[#DC2626]',
        'Deadline': 'bg-[#F59E42]',
    };

    // Custom date cell for calendar
    function CustomDateCellWrapper({ value, children }) {
        const events = getEventsForDate(value);
        const isEmpty = events.length === 0;
        return (
            <div className={`relative h-full w-full min-h-[80px] min-w-[80px] p-2 ${isEmpty ? 'bg-[#F3F4F6]' : bgColor[events[0].status] || 'bg-[#F3F4F6]'} border border-[#E5E7EB] flex flex-col justify-start items-start transition`}>
                <div className="absolute top-1 left-2 text-[18px] text-[#9CA3AF] font-medium">{moment(value).date()}</div>
                {events.map((ev, i) => (
                    <div key={i} className="absolute bottom-1 left-2 mb-1 flex flex-col items-start w-full">
                        <span className="font-medium text-[17px] w-2/3 line-clamp-4">{ev.title}</span>
                        <span className={`flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full text-xs font-medium ${statusBgMap[ev.status]}`}>
                            <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[ev.status]}`}></span>
                            {ev.status}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <NavbarComponent />
            <div className="w-full mx-auto py-8 px-4 md:px-8 mt-12">
                <h2 className="text-[24px] font-semibold mb-4">Tracking Dashboard</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 mb-4">
                    {summaryStats.map((stat) => (
                        <div key={stat.label} className={`p-3 sm:p-4 rounded shadow text-left ${statsStyles[stat.label]}`}>
                            <div className="text-[11px] sm:text-[13px] md:text-[16px]  capitalize">{stat.label.replace(/([A-Z])/g, " $1").trim()}</div>
                            <div className={`text-[18px] sm:text-[24px] md:text-[32px] font-semibold`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Search and Actions */}
                <div className="flex flex-row items-center justify-between mb-4 gap-2">
                    <div className="flex relative w-full md:w-1/3 items-center gap-2">
                        <MdOutlineSearch className="absolute left-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search proposals"
                            className="border rounded px-3 py-2 w-full bg-white border-[#E5E7EB] text-[#9CA3AF] pl-10 focus:outline-none focus:ring-1 focus:ring-[#111827]"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="justify-end group flex gap-2">
                        <button
                            className="flex items-center gap-1 px-4 py-2 border rounded text-[#2563EB] border-[#2563EB] text-[14px] md:text-[16px] group-hover:bg-[#2563EB] group-hover:text-white"
                            onClick={() => setShowDeleteOptions(true)}
                        >
                            <MdOutlineDeleteForever className="w-5 h-5 group-hover:text-white" /> Delete
                        </button>
                    </div>
                </div>

                {/* Proposals Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                {showDeleteOptions && <th className="px-4 py-2"></th>}
                                <th className="px-4 py-2 text-left font-medium">Proposal Name</th>
                                <th className="px-4 py-2 text-left font-medium">Client Name</th>
                                <th className="px-4 py-2 text-left font-medium">Current Editor</th>
                                <th className="px-4 py-2 text-left font-medium">Deadline</th>
                                <th className="px-4 py-2 text-left font-medium">Status</th>
                                <th className="px-4 py-2 text-left font-medium">Submission Date</th>
                                <th className="px-4 py-2 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProposals
                                .map((p, idx) => {
                                    const realIdx = (currentProposalPage - 1) * PAGE_SIZE + idx;
                                    return (
                                        <tr key={realIdx} className="border-t">
                                            {showDeleteOptions && (
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProposals.includes(realIdx)}
                                                        onChange={() => handleSelectProposal(realIdx)}
                                                    />
                                                </td>
                                            )}
                                            <td className="px-4 py-2 font-semibold">{p.name}</td>
                                            <td className="px-4 py-2">{p.client}</td>
                                            {p.editor === userName ? (
                                                <td className="px-4 py-2 flex items-center gap-2">
                                                    <span>{userName} (You)</span>
                                                    <button
                                                        className="text-[#2563EB]"
                                                        title="Assign Editor"
                                                        onClick={() => setShowAddPersonIdx(realIdx)}
                                                    >
                                                        <MdPersonAddAlt1 className="w-4 h-4" />
                                                    </button>
                                                    {showAddPersonIdx === realIdx && (
                                                        <div className="absolute bg-white border rounded shadow z-10 mt-8">
                                                            <ul>
                                                                {employees.filter(emp => emp.name !== userName).map(emp => (
                                                                    <li key={emp.name}>
                                                                        <button
                                                                            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                                                            onClick={() => handleEditorChange(realIdx, emp.name)}
                                                                        >
                                                                            {emp.name}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </td>
                                            ) : (
                                                <td className="px-4 py-2">{p.editor}</td>
                                            )}
                                            <td className="px-4 py-2">{p.deadline}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center text-center">
                                                    {statusBadge(p.status)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">{p.submission}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <button className="text-[#2563EB]" title="Edit" onClick={() => handleEdit(realIdx)}>
                                                        <MdOutlineEdit className="w-5 h-5" />
                                                    </button>
                                                    <button className="text-[#2563EB]" title="View">
                                                        <MdOutlineVisibility className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    {/* Pagination controls for proposals */}
                    <div className="flex justify-end gap-2 my-2">
                        <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            onClick={() => setCurrentProposalPage(p => Math.max(1, p - 1))}
                            disabled={currentProposalPage === 1}
                        >Prev</button>
                        {Array.from({ length: totalProposalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`px-2 py-1 border rounded ${currentProposalPage === i + 1 ? 'bg-[#2563EB] text-white' : ''}`}
                                onClick={() => setCurrentProposalPage(i + 1)}
                            >{i + 1}</button>
                        ))}
                        <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            onClick={() => setCurrentProposalPage(p => Math.min(totalProposalPages, p + 1))}
                            disabled={currentProposalPage === totalProposalPages}
                        >Next</button>
                    </div>
                    {showDeleteOptions && (
                        <div className="flex gap-4 mt-4 justify-end mb-4 px-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDeleteProposals}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                onClick={() => {
                                    setShowDeleteOptions(false);
                                    setSelectedProposals([]);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Calendar Section */}
                <div className="bg-white rounded-lg shadow p-4 mb-8">
                    <div className="flex gap-2 mb-4 items-center">
                        <select value={calendarMonth} onChange={e => setCalendarMonth(Number(e.target.value))} className="border rounded px-2 py-1">
                            {monthOptions.map((m, idx) => (
                                <option key={m} value={idx}>{m}</option>
                            ))}
                        </select>
                        <select value={calendarYear} onChange={e => setCalendarYear(Number(e.target.value))} className="border rounded px-2 py-1">
                            {yearOptions.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <Calendar
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 1000, width: '100%' }}
                        views={['month']}
                        toolbar={false}
                        date={new Date(calendarYear, calendarMonth, 1)}
                        components={{
                            month: {
                                dateCellWrapper: CustomDateCellWrapper,
                                dateHeader: () => null // Hide default date number
                            }
                        }}
                    />
                </div>

                {/* Deleted Proposals Table */}
                <h3 className="text-[18px] sm:text-[24px] font-semibold mb-2">Deleted Proposals</h3>
                <div className="bg-white rounded-lg overflow-x-auto shadow mb-8">
                    <table className="min-w-full text-sm ">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-4 py-2 text-left font-medium">Proposal Name</th>
                                <th className="px-4 py-2 text-left font-medium">Client Name</th>
                                <th className="px-4 py-2 text-left font-medium">Deadline</th>
                                <th className="px-4 py-2 text-left font-medium">Status</th>
                                <th className="px-4 py-2 text-left font-medium">Restore in</th>
                                <th className="px-4 py-2 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDeletedProposals.map((p, idx) => (
                                <tr key={idx + (currentDeletedPage - 1) * PAGE_SIZE} className="border-t">
                                    <td className="px-4 py-2 font-semibold">{p.name}</td>
                                    <td className="px-4 py-2">{p.client}</td>
                                    <td className="px-4 py-2">{p.deadline}</td>
                                    <td className="px-4 py-2">{statusBadge(p.status)}</td>
                                    <td className="px-4 py-2">{p.restore}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <button className="text-[#2563EB]" title="Restore">
                                                <MdOutlineRotateLeft className="w-5 h-5" />
                                            </button>
                                            <button className="text-[#2563EB]" title="Delete Permanently">
                                                <MdOutlineDeleteForever className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination controls for deleted proposals */}
                    <div className="flex justify-end gap-2 my-2">
                        <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            onClick={() => setCurrentDeletedPage(p => Math.max(1, p - 1))}
                            disabled={currentDeletedPage === 1}
                        >Prev</button>
                        {Array.from({ length: totalDeletedPages }, (_, i) => (
                            <button
                                key={i}
                                className={`px-2 py-1 border rounded ${currentDeletedPage === i + 1 ? 'bg-[#2563EB] text-white' : ''}`}
                                onClick={() => setCurrentDeletedPage(i + 1)}
                            >{i + 1}</button>
                        ))}
                        <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            onClick={() => setCurrentDeletedPage(p => Math.min(totalDeletedPages, p + 1))}
                            disabled={currentDeletedPage === totalDeletedPages}
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
