import { useState, useEffect } from 'react';
import NavbarComponent from './NavbarComponent';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdOutlineEdit, MdOutlineSearch, MdOutlineRotateLeft, MdOutlineDeleteForever, MdPersonAddAlt1, MdOutlineClose } from "react-icons/md";
import axios from 'axios';

const localizer = momentLocalizer(moment);

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

// Helper: bg color map for calendar
const bgColor = {
    'In Progress': 'bg-[#DBEAFE] bg-opacity-50',
    'Submitted': 'bg-[#DCFCE7] bg-opacity-50',
    'Won': 'bg-[#FEF9C3] bg-opacity-50',
    'Rejected': 'bg-[#FEE2E2] bg-opacity-50',
    'Deadline': 'bg-[#FEF3C7] bg-opacity-50',
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

function statusBadge(status) {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}

const PAGE_SIZE = 5;

const Dashboard = () => {
    const user = localStorage.getItem("user");
    const userName = user ? (JSON.parse(user).fullName) : "Unknown User";
    const userEmail = user ? (JSON.parse(user).email) : "No email found";

    // State for backend data
    const [proposalsState, setProposalsState] = useState([]);
    const [deletedProposals, setDeletedProposals] = useState([]);
    const [summaryStats, setSummaryStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [showAddPersonIdx, setShowAddPersonIdx] = useState(null);
    const [selectedProposals, setSelectedProposals] = useState([]);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [currentProposalPage, setCurrentProposalPage] = useState(1);
    const [currentDeletedPage, setCurrentDeletedPage] = useState(1);
    const [calendarMonth, setCalendarMonth] = useState(moment().month());
    const [calendarYear, setCalendarYear] = useState(moment().year());
    const [openDropdownDate, setOpenDropdownDate] = useState(null);
    const [addEventModalOpen, setAddEventModalOpen] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [editIdx, setEditIdx] = useState(null);
    const [editForm, setEditForm] = useState({ deadline: "", submittedAt: "", status: "" });

    const handleEditClick = (idx, proposal) => {
        setEditIdx(idx);
        setEditForm({
            deadline: proposal.deadline ? new Date(proposal.deadline).toISOString().split('T')[0] : "",
            submittedAt: proposal.submittedAt ? new Date(proposal.submittedAt).toISOString().split('T')[0] : "",
            status: proposal.status
        });
    };

    const handleEditChange = (field, value) => {
        console.log(field, value);
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProposal = async (proposalId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `https://proposal-form-backend.vercel.app/api/dashboard/updateProposal`,
                { proposalId, updates: editForm },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.status === 200) {
                // ✅ Update local proposals list
                setProposalsState(prev =>
                    prev.map(p =>
                        p._id === proposalId ? { ...p, ...editForm } : p
                    )
                );

                setEditIdx(null); // exit edit mode
                alert("Proposal updated!");
            }
        } catch (err) {
            console.error("Error updating proposal:", err);
            alert("Failed to update proposal");
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token'); // Adjust if you store token differently
                const res = await axios.get('https://proposal-form-backend.vercel.app/api/dashboard/getDashboardData', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = res.data;
                setProposalsState(data.proposals || []);
                setDeletedProposals(data.deletedProposals || []);
                setSummaryStats([
                    { label: 'All Proposals', value: data.totalProposals || 0 },
                    { label: 'In Progress', value: data.inProgressProposals || 0 },
                    { label: 'Submitted', value: data.submittedProposals || 0 },
                    { label: 'Won', value: data.wonProposals || 0 },
                ]);
                setCalendarEvents(data.calendarEvents || []);
                setEmployees(data.employees || []);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleSetCurrentEditor = async (idx, editorId) => {
        const token = localStorage.getItem('token');
        const res = await axios.put('https://proposal-form-backend.vercel.app/api/dashboard/setCurrentEditor', {
            proposalId: proposalsState[idx]._id,
            editorId: editorId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            const editor = employees.find(emp => emp.employeeId === editorId);
            setProposalsState(prev => prev.map((p, i) => i === idx ? { ...p, currentEditor: { _id: editor.employeeId, fullName: editor.name, email: editor.email } } : p));
            setShowAddPersonIdx(null);
            alert("Editor set successfully");
        }
    };

    const handleSelectProposal = (idx) => {
        setSelectedProposals(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const handleDeleteProposals = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('https://proposal-form-backend.vercel.app/api/dashboard/deleteProposals', {
                proposalIds: selectedProposals.map(idx => proposalsState[idx]._id)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                // Add restoreIn field to proposals being moved to deletedProposals
                const proposalsToDelete = proposalsState.filter((_, idx) => selectedProposals.includes(idx));
                console.log("proposalsToDelete", proposalsToDelete);
                const proposalsWithRestoreIn = proposalsToDelete.map(proposal => ({
                    ...proposal,
                    restoreIn: "15 days"
                }));

                console.log("proposalsWithRestoreIn", proposalsWithRestoreIn);

                setDeletedProposals(prev => [...prev, ...proposalsWithRestoreIn]);
                setProposalsState(prev => prev.filter((_, idx) => !selectedProposals.includes(idx)));
                setSelectedProposals([]);
                setShowDeleteOptions(false);
            } else {
                setError('Failed to delete proposals');
            }
        } catch (error) {
            setError('Failed to delete proposals');
        }
    };

    const handleRestoreProposal = async (idx) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('https://proposal-form-backend.vercel.app/api/dashboard/restoreProposal', {
                proposalId: deletedProposals[idx]._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                // Remove restoreIn field when restoring proposal
                const { restoreIn, ...proposalWithoutRestoreIn } = deletedProposals[idx];
                setProposalsState(prev => [...prev, proposalWithoutRestoreIn]);
                setDeletedProposals(prev => prev.filter((_, i) => i !== idx));
            } else {
                setError('Failed to restore proposal');
            }
        } catch (error) {
            setError('Failed to restore proposal');
        }
    };

    const handleDeletePermanently = async (idx) => {
        try {
            if (window.confirm('Are you sure you want to delete this proposal permanently?')) {
                const token = localStorage.getItem('token');
                const res = await axios.put('https://proposal-form-backend.vercel.app/api/dashboard/deletePermanently', {
                    proposalId: deletedProposals[idx]._id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    //Update the stats
                    const deletedProposal = deletedProposals[idx];
                    setSummaryStats(prev => prev.map(stat => {
                        if (stat.label === "All Proposals") {
                            return { ...stat, value: stat.value - 1 };
                        }
                        if (stat.label === "In Progress" && deletedProposal.status === "In Progress") {
                            return { ...stat, value: stat.value - 1 };
                        }
                        if (stat.label === "Submitted" && deletedProposal.status === "Submitted") {
                            return { ...stat, value: stat.value - 1 };
                        }
                        if (stat.label === "Won" && deletedProposal.status === "Won") {
                            return { ...stat, value: stat.value - 1 };
                        }
                        if (stat.label === "Rejected" && deletedProposal.status === "Rejected") {
                            return { ...stat, value: stat.value - 1 };
                        }
                        return stat;
                    }));

                    setDeletedProposals(prev => prev.filter((_, i) => i !== idx));
                } else {
                    setError('Failed to delete proposal permanently');
                }
            } else {
                // do nothing
            }
        } catch (error) {
            setError('Failed to delete proposal permanently');
        }
    };

    const AddEventModal = ({ isOpen, onClose }) => {
        const [formData, setFormData] = useState({
            title: '',
            start: '',
            end: '',
        });

        const [errors, setErrors] = useState({});
        const [calendarError, setCalendarError] = useState('');

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            // Handle form submission logic here
            console.log('Event Data:', formData);
            if (!formData.title) {
                setErrors({ title: 'Title is required' });
                return;
            }
            if (!formData.start) {
                setErrors({ start: 'Start date is required' });
                return;
            }
            if (!formData.end) {
                setErrors({ end: 'End date is required' });
                return;
            }
            setErrors({});
            console.log('Event Data:', formData);
            try {
                const token = localStorage.getItem('token');

                const res = await axios.post('https://proposal-form-backend.vercel.app/api/dashboard/addCalendarEvent', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 201) {
                    setFormData({ title: '', start: '', end: '' });
                    setCalendarError('');
                    setErrors({});
                    alert('Event added successfully');
                    onClose();
                } else {
                    setCalendarError('Failed to add event');
                }
            } catch (error) {
                setCalendarError('Failed to add event');
            }
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add Event</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <MdOutlineClose className="w-6 h-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Event Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Start Date</label>
                            <input
                                type="date"
                                name="start"
                                value={formData.start}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                            {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">End Date</label>
                            <input
                                type="date"
                                name="end"
                                value={formData.end}
                                min={formData.start}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                            {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}
                        </div>
                        <button
                            type="submit"
                            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition"
                        >
                            Add Event
                        </button>
                    </form>
                    {calendarError && <p className="text-red-500 mt-4">{calendarError}</p>}
                </div>
            </div>
        );
    };

    const handleAddEvent = () => {
        setAddEventModalOpen(true);
    };

    // Pagination logic for proposals
    const filteredProposals = proposalsState.filter(p => (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()));
    const totalProposalPages = Math.ceil(filteredProposals.length / PAGE_SIZE);
    const paginatedProposals = filteredProposals.slice((currentProposalPage - 1) * PAGE_SIZE, currentProposalPage * PAGE_SIZE);

    // Pagination logic for deleted proposals
    const totalDeletedPages = Math.ceil(deletedProposals.length / PAGE_SIZE);
    const paginatedDeletedProposals = deletedProposals.slice((currentDeletedPage - 1) * PAGE_SIZE, currentDeletedPage * PAGE_SIZE);

    // Helper: get all years in a reasonable range
    // Get 5 years before and after the current year
    const currentYear = moment().year();
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const monthOptions = moment.months();

    // Helper: get events for a specific date
    function getEventsForDate(date) {
        return calendarEvents.filter(ev =>
            moment(ev.startDate).isSameOrBefore(date, 'day') && moment(ev.endDate).isSameOrAfter(date, 'day')
        );
    }

    // Custom date cell for calendar
    function CustomDateCellWrapper({ value }) {
        const events = getEventsForDate(value);
        const isEmpty = events.length === 0;

        // Sort: Deadline first, then others
        const sortedEvents = [...events].sort((a, b) => {
            if (a.status === "Deadline") return -1;
            if (b.status === "Deadline") return 1;
            return 0;
        });

        // For dropdown toggle
        const dateKey = moment(value).format("YYYY-MM-DD");
        const isDropdownOpen = openDropdownDate === dateKey;

        return (
            <div
                className={`relative h-full w-full min-h-[56px] min-w-[56px] p-1 sm:min-h-[80px] sm:min-w-[80px] sm:p-2 ${isEmpty ? 'bg-[#F3F4F6]' : bgColor[sortedEvents[0]?.status]} border border-[#E5E7EB] flex flex-col justify-start items-start transition`}
                style={{ fontSize: '12px' }}
            >
                <div className="absolute top-1 left-2 text-[18px] text-[#9CA3AF] font-medium">{moment(value).date()}</div>
                {sortedEvents.length > 0 && (
                    <>
                        {/* Show the most important event */}
                        <div className="absolute bottom-6 left-2 mb-1 flex flex-col items-start w-full">
                            <span className="font-medium text-[13px] sm:text-[17px] line-clamp-4 w-full pr-2">{sortedEvents[0].title}</span>
                            <span className={`flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium ${statusBgMap[sortedEvents[0].status]}`}>
                                <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[sortedEvents[0].status]}`}></span>
                                {sortedEvents[0].status}
                            </span>
                        </div>
                        {/* Show "+X more" if more events */}
                        {sortedEvents.length > 1 && (
                            <div
                                className="absolute bottom-1 left-2 text-[10px] sm:text-[11px] text-[#2563EB] cursor-pointer underline font-medium"
                                onClick={() => setOpenDropdownDate(isDropdownOpen ? null : dateKey)}
                            >
                                +{sortedEvents.length - 1} more
                            </div>
                        )}
                        {/* Dropdown with all events */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 left-2 bottom-8 bg-[#F3F4F6] border rounded shadow-lg p-2 w-40 sm:w-56">
                                {sortedEvents.map((ev, i) => (
                                    <div key={i} className="mb-2 last:mb-0">
                                        <span className="font-medium text-[12px] sm:text-base">{ev.title}</span>
                                        <span className={`ml-2 px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium ${statusBgMap[ev.status]}`}>
                                            <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[ev.status]} mr-1`}></span>
                                            {ev.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    useEffect(() => {
        console.log("deletedProposals", deletedProposals);
    }, [deletedProposals]);

    useEffect(() => {
        console.log("proposalsState", proposalsState);
    }, [proposalsState]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen">
            <NavbarComponent />
            <main className="w-full mx-auto py-8 px-4 md:px-8 mt-12">
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

                                            <td className="px-4 py-2 font-semibold">
                                                <a
                                                    href={`https://proposal-form-backend.vercel.app/api/proposal/${p._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#2563EB] hover:underline"
                                                >
                                                    {p.title}
                                                </a>
                                            </td>

                                            <td className="px-4 py-2">{p.client}</td>

                                            {p.currentEditor && p.currentEditor.email === userEmail ? (
                                                <td className="px-4 py-2 relative">
                                                    <div className="flex items-center gap-2">
                                                        <span>{userName.split(" ")[0]} (You)</span>
                                                        <button
                                                            className="text-[#2563EB]"
                                                            title="Assign Editor"
                                                            onClick={() => setShowAddPersonIdx(realIdx)}
                                                        >
                                                            <MdPersonAddAlt1 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {showAddPersonIdx === realIdx && (
                                                        <div className="absolute bg-[#FFFFFF] border border-[#E5E7EB] rounded-md shadow z-100 mt-4 w-40 p-2">
                                                            <h2 className="text-[14px] font-medium mb-2">Assign Editor</h2>
                                                            <div>
                                                                <ul>
                                                                    {employees.filter(emp => emp.name !== userName).map(emp => (
                                                                        <li key={emp.name}>
                                                                            <button
                                                                                className="block px-4 py-2 bg-[#F3F4F6] rounded-md border hover:bg-[#2563EB] hover:text-white w-full text-left text-[14px] transition-colors"
                                                                                onClick={() => handleSetCurrentEditor(realIdx, emp.employeeId)}
                                                                            >
                                                                                {emp.name}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <button
                                                                className="text-[#111827] absolute top-2 right-2"
                                                                onClick={() => setShowAddPersonIdx(null)}
                                                            >
                                                                <MdOutlineClose className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            ) : (
                                                <td className="px-4 py-2">{p.currentEditor ? p.currentEditor.fullName : 'No Editor Assigned'}</td>
                                            )}

                                            <td className="px-4 py-2">
                                                {editIdx === realIdx ? (
                                                    <input
                                                        type="date"
                                                        value={editForm.deadline}
                                                        onChange={e => handleEditChange("deadline", e.target.value)}
                                                        className="border border-[#111827] rounded px-2 py-1 text-[#111827] text-[16px] w-full bg-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                                                    />
                                                ) : (
                                                    p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'No deadline'
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {editIdx === realIdx ? (
                                                    <select className="w-full border border-[#111827] rounded px-3 py-2 text-[#111827] text-[16px] bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#2563EB] min-w-[140px]" value={editForm.status} onChange={e => handleEditChange("status", e.target.value)}>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Submitted">Submitted</option>
                                                        <option value="Won">Won</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                ) : (
                                                    statusBadge(p.status)
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {editIdx === realIdx ? (
                                                    <input
                                                        type="date"
                                                        value={editForm.submittedAt}
                                                        onChange={e => handleEditChange("submittedAt", e.target.value)}
                                                        className="border border-[#111827] rounded px-2 py-1 text-[#111827] text-[16px] w-full bg-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                                                    />
                                                ) : (
                                                    p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'Not submitted'
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {editIdx === realIdx ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="flex items-center gap-1 text-[16px] text-[#2563EB] hover:text-white hover:bg-[#2563EB] rounded-md px-2 py-1 transition-colors"
                                                            title="Save"
                                                            onClick={() => handleSaveProposal(p._id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-1 text-[16px] text-[#111827] hover:text-white hover:bg-[#111827] rounded-md px-2 py-1 transition-colors"
                                                            title="Cancel"
                                                            onClick={() => setEditIdx(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="text-[#2563EB] flex items-center gap-1 hover:text-[#1D4ED8] transition-colors"
                                                        title="Edit Details"
                                                        onClick={() => handleEditClick(realIdx, p)}
                                                    >
                                                        <MdOutlineEdit className="w-5 h-5" /> Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            {/* if no proposals, show a message */}
                            {paginatedProposals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">No proposals found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination controls for proposals */}
                    <div className="flex justify-end gap-2 my-2 px-4">
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
                <h3 className="text-[18px] sm:text-[24px] font-semibold mt-4 mb-2">Calendar</h3>
                <div className="bg-white rounded-lg shadow p-2 sm:p-4 mb-8 overflow-x-auto">
                    <div className="flex flex-col xs:flex-row items-center justify-between mb-4">
                        <div className="flex gap-2 mb-4">
                            <select value={calendarMonth} onChange={e => setCalendarMonth(Number(e.target.value))} className="bg-[#F3F4F6] border rounded-md px-2 py-1 text-[#111827] text-xs sm:text-base">
                                {monthOptions.map((m, idx) => (
                                    <option key={m} value={idx}>{m}</option>
                                ))}
                            </select>
                            <select value={calendarYear} onChange={e => setCalendarYear(Number(e.target.value))} className="bg-[#F3F4F6] border rounded-md px-2 py-1 text-[#111827] text-xs sm:text-base">
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <button
                                className="flex items-center gap-1 px-2 py-1 border rounded text-[#2563EB] border-[#2563EB] text-[14px] md:text-[16px] hover:bg-[#2563EB] hover:text-white"
                                onClick={() => handleAddEvent()}
                            >
                                <MdOutlineEdit className="w-5 h-5" /> Add Event
                            </button>
                        </div>
                    </div>

                    <div className="w-[600px] sm:w-full">
                        <Calendar
                            localizer={localizer}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 1000, width: '100%' }}
                            views={['month']}
                            toolbar={false}
                            date={new Date(calendarYear, calendarMonth, 1)}
                            onNavigate={date => {
                                setCalendarMonth(date.getMonth());
                                setCalendarYear(date.getFullYear());
                            }}
                            components={{
                                month: {
                                    dateCellWrapper: CustomDateCellWrapper,
                                    dateHeader: () => null
                                }
                            }}
                        />
                    </div>
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
                                    <td className="px-4 py-2 font-semibold">{p.title}</td>
                                    <td className="px-4 py-2">{p.client}</td>
                                    <td className="px-4 py-2">{new Date(p.deadline).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</td>
                                    <td className="px-4 py-2">{statusBadge(p.status)}</td>
                                    <td className="px-4 py-2">{p.restoreIn}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <button className="text-[#2563EB]" title="Restore" onClick={() => handleRestoreProposal(idx)}>
                                                <MdOutlineRotateLeft className="w-5 h-5" />
                                            </button>
                                            <button className="text-[#2563EB]" title="Delete Permanently" onClick={() => handleDeletePermanently(idx)}>
                                                <MdOutlineDeleteForever className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {/* if no deleted proposals, show a message */}
                            {paginatedDeletedProposals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">No deleted proposals found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination controls for deleted proposals */}
                    <div className="flex justify-end gap-2 my-2 px-4">
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

                {/* Add Event Modal */}
                <AddEventModal
                    isOpen={addEventModalOpen}
                    onClose={() => setAddEventModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default Dashboard;
