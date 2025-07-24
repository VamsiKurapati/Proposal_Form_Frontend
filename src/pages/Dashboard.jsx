import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdOutlineEdit, MdOutlineSearch, MdOutlineAdd, MdOutlineDelete, MdOutlineVisibility, MdOutlineRestore, MdOutlineDeleteForever } from "react-icons/md";
import { useProfile } from '../context/ProfileContext';

const localizer = momentLocalizer(moment);

const summaryStats = [
    { label: 'All Proposals', value: 120, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: 45, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Submitted', value: 62, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Won', value: 10, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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
    "Won": "bg-[#DCFCE7] text-[#15803D]",
    "Submitted": "bg-[#DCFCE7] text-[#15803D]",
    "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
    "Urgent": "bg-[#FEE2E2] text-[#DC2626]",
    "Scheduled": "bg-[#DBEAFE] text-[#2563EB]",
    "On Track": "bg-[#DCFCE7] text-[#15803D]",
    "Pending": "bg-[#FEF9C3] text-[#CA8A04]",
    "Full Access": "bg-[#DBEAFE] text-[#2563EB]",
    "Admin": "bg-[#DCFCE7] text-[#15803D]",
    "Editor": "bg-[#FEF9C3] text-[#CA8A04]",
    "Viewer": "bg-[#F3F4F6] text-[#4B5563]",
};

const calendarEvents = [
    {
        title: 'Sustainable Office Park Development',
        start: new Date(2025, 3, 1),
        end: new Date(2025, 3, 1),
        status: 'Submitted',
    },
    {
        title: 'High-Tech Campus Expansion',
        start: new Date(2025, 3, 6),
        end: new Date(2025, 3, 6),
        status: 'In Progress',
    },
    {
        title: 'Affordable Housing Project',
        start: new Date(2025, 3, 8),
        end: new Date(2025, 3, 8),
        status: 'Won',
    },
    {
        title: 'Educational Facility Modernization - Design-Build',
        start: new Date(2025, 3, 14),
        end: new Date(2025, 3, 14),
        status: 'Rejected',
    },
    {
        title: 'Urban Infrastructure Improvement',
        start: new Date(2025, 3, 23),
        end: new Date(2025, 3, 23),
        status: 'Submitted',
    },
    {
        title: 'Historic Landmark Restoration',
        start: new Date(2025, 3, 29),
        end: new Date(2025, 3, 29),
        status: 'Won',
    },
    {
        title: 'Walmart Fuel Station',
        start: new Date(2025, 3, 4),
        end: new Date(2025, 3, 4),
        status: 'Deadline',
    },
    {
        title: 'Smart City Technology Integration',
        start: new Date(2025, 3, 18),
        end: new Date(2025, 3, 18),
        status: 'Rejected',
    },
    {
        title: 'Mixed-Use Development Opportunity',
        start: new Date(2025, 3, 20),
        end: new Date(2025, 3, 20),
        status: 'Won',
    },
    {
        title: 'Civil Design Services',
        start: new Date(2025, 3, 26),
        end: new Date(2025, 3, 26),
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

const Dashboard = () => {
    const { companyData } = useProfile();

    // const userName = companyData?.companyName || 'John Doe';
    const userName = 'John Doe';
    // console.log(userName);
    // console.log(proposals[0].editor === userName);

    const [search, setSearch] = useState('');

    const [proposalsState, setProposalsState] = useState(proposals);

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

    const handleEditorChange = (idx, newEditor) => {
        setProposalsState(prev => prev.map((p, i) => i === idx ? { ...p, editor: newEditor } : p));
    };

    return (
        <div className="min-h-screen bg-gray-200">
            <NavbarComponent />
            <div className="max-w-7xl mx-auto py-8 px-4">
                <h2 className="text-xl font-semibold mb-4">Tracking Dashboard</h2>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {summaryStats.map((stat) => (
                        <div key={stat.label} className={`rounded-lg p-6 shadow ${stat.bg}`}>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>
                {/* Search and Actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div className="flex relative w-full md:w-1/3 items-center gap-2">
                        <MdOutlineSearch className="absolute left-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search proposals"
                            className="border rounded px-3 py-2 w-full bg-white focus:outline-none pl-10"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button className="flex items-center gap-1 px-4 py-2 border rounded text-[#2563EB] border-[#2563EB]">
                            <MdOutlineDelete /> Delete
                        </button>
                        <button className="flex items-center gap-1 px-4 py-2 bg-[#2563EB] text-white rounded">
                            <MdOutlineAdd /> Add
                        </button>
                    </div>
                </div>
                {/* Proposals Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
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
                            {proposalsState
                                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                                .map((p, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2">{p.name}</td>
                                        <td className="px-4 py-2">{p.client}</td>
                                        {p.editor === userName ? (
                                            <td className="px-4 py-2">
                                                <select
                                                    className="border rounded px-2 py-1"
                                                    value={p.editor}
                                                    onChange={e => handleEditorChange(idx, e.target.value)}
                                                >
                                                    {employees.map(emp => (
                                                        <option key={emp.name} value={emp.name}>{emp.name === userName ? `${emp.name} (You)` : emp.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        ) : (
                                            <td className="px-4 py-2">{p.editor}</td>
                                        )}
                                        <td className="px-4 py-2">{p.deadline}</td>
                                        <td className="px-4 py-2">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-2">{p.submission}</td>
                                        <td className="px-4 py-2 flex gap-2 items-center mt-2">
                                            <button className="text-[#2563EB]" title="Edit" onClick={() => handleEdit(idx)}>
                                                <MdOutlineEdit />
                                            </button>
                                            <button className="text-[#2563EB]" title="View">
                                                <MdOutlineVisibility />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {/* Calendar Section */}
                <div className="bg-white rounded-lg shadow p-4 mb-8">
                    <h3 className="text-lg font-semibold mb-4">July, 2025</h3>
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        eventPropGetter={(event) => {
                            let bg = '#e5e7eb';
                            if (event.status === 'Submitted') bg = '#d1fae5';
                            if (event.status === 'In Progress') bg = '#dbeafe';
                            if (event.status === 'Won') bg = '#fef9c3';
                            if (event.status === 'Rejected') bg = '#fee2e2';
                            if (event.status === 'Deadline') bg = '#fef3c7';
                            return { style: { backgroundColor: bg, color: '#222', borderRadius: 6 } };
                        }}
                        views={['month']}
                        toolbar={false}
                    />
                </div>
                {/* Deleted Proposals Table */}
                <div className="bg-white rounded-lg shadow p-4 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Deleted Proposals</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left font-medium">Proposal Name</th>
                                    <th className="px-4 py-2 text-left font-medium">Client Name</th>
                                    <th className="px-4 py-2 text-left font-medium">Deadline</th>
                                    <th className="px-4 py-2 text-left font-medium">Status</th>
                                    <th className="px-4 py-2 text-left font-medium">Restore in</th>
                                    <th className="px-4 py-2 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedProposals.map((p, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2">{p.name}</td>
                                        <td className="px-4 py-2">{p.client}</td>
                                        <td className="px-4 py-2">{p.deadline}</td>
                                        <td className="px-4 py-2">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-2">{p.restore}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button className="text-[#2563EB]" title="Restore">
                                                <MdOutlineRestore />
                                            </button>
                                            <button className="text-[#2563EB]" title="Delete Permanently">
                                                <MdOutlineDeleteForever />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
