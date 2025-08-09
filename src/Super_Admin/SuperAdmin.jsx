import React, { useState, useEffect } from 'react';
import {
    MdOutlineSearch,
    MdOutlineNotifications,
    MdOutlinePerson,
    MdOutlineManageAccounts,
    MdOutlinePayments,
    MdOutlineHeadsetMic,
    MdOutlineFilterList,
    MdOutlineMoreVert,
    MdOutlineGroup,
    MdOutlineLogout,
    MdOutlineLock,
    MdOutlineDocumentScanner,
    MdOutlineFileUpload,
    MdOutlineEdit,
    MdOutlineMoney,
    MdOutlinePaid,
    MdOutlinePriorityHigh,
    MdOutlinePayment,
    MdOutlineKeyboardArrowDown,
    MdOutlineShoppingBag,
    MdOutlineHeadphones,
    MdOutlineAccountCircle,
    MdOutlineMenu
} from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('user-management');

    // Search Terms
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    // Tabs
    const [supportTab, setSupportTab] = useState('active');
    const [paymentsTab, setPaymentsTab] = useState('payments');

    // Completed Tickets
    const [completedTickets, setCompletedTickets] = useState(false);

    // Profile
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Edit
    const [editUser, setEditUser] = useState(false);
    const [editTransaction, setEditTransaction] = useState(false);
    const [editSupport, setEditSupport] = useState(false);

    // Filters
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
    const [transactionDateFilter, setTransactionDateFilter] = useState('all');
    const [supportStatusFilter, setSupportStatusFilter] = useState('all');
    const [supportPriorityFilter, setSupportPriorityFilter] = useState('all');
    const [supportTypeFilter, setSupportTypeFilter] = useState('all');
    const [notificationTimeFilter, setNotificationTimeFilter] = useState('All Time');
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState('All Categories');

    // Filter Modals
    const [userFilterModal, setUserFilterModal] = useState(false);
    const [transactionFilterModal, setTransactionFilterModal] = useState(false);
    const [supportFilterModal, setSupportFilterModal] = useState(false);
    const [notificationTimeFilterModal, setNotificationTimeFilterModal] = useState(false);
    const [notificationCategoryFilterModal, setNotificationCategoryFilterModal] = useState(false);

    // Data
    const [usersStats, setUsersStats] = useState({});
    const [companiesData, setCompaniesData] = useState([]);
    const [paymentsStats, setPaymentsStats] = useState({});
    const [paymentsData, setPaymentsData] = useState([]);
    let planManagementStats = { "Active Users": 0, "Revenue This Month": 0 };
    const [supportTicketsStats, setSupportTicketsStats] = useState({});
    const [supportTicketsData, setSupportTicketsData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);

    const baseUrl = "https://proposal-form-backend.vercel.app/api/admin";

    const handleUserStatusChange = (id, status) => {
        //console.log(id, status);
        setFilteredUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status } : user
        ));
    };

    const handleTransactionStatusChange = (id, status) => {
        //console.log(id, status);
        setFilteredTransactions(prev => prev.map(transaction => {
            const matches = transaction.transactionId === id || transaction.id === id;
            return matches ? { ...transaction, status } : transaction;
        }));
    };

    const handleSupportStatusChange = (id, status) => {
        //console.log(id, status);
        setFilteredSupport(prev => prev.map(support =>
            support.id === id ? { ...support, status } : support
        ));
    };

    // Save handlers: call backend then update local state on success
    const saveUserStatus = async (userId) => {
        const user = (filteredUsers || []).find(u => u._id === userId);
        if (!user) return setEditUser(null);
        try {
            const res = await axios.put(`${baseUrl}/updateCompanyStatus`, {
                companyId: userId,
                status: user.status || 'Active'
            });
            if (res.status === 200) {
                setCompaniesData(prev => (prev || []).map(u => u._id === userId ? { ...u, status: user.status || 'Active' } : u));
                setFilteredUsers(prev => (prev || []).map(u => u._id === userId ? { ...u, status: user.status || 'Active' } : u));
                setEditUser(null);
            }
        } catch (e) {
            alert('Failed to update user status');
        }
    };

    const saveTransactionStatus = async (transactionId, rowId) => {
        const tx = (filteredTransactions || []).find(t => t.transaction_id === transactionId || t._id === rowId);
        if (!tx) return setEditTransaction(null);
        try {
            const res = await axios.put(`${baseUrl}/updatePaymentStatus`, {
                transaction_id: tx.transaction_id,
                status: tx.status
            });
            if (res.status === 200) {
                setPaymentsData(prev => (prev || []).map(t => (t.transaction_id === tx.transaction_id || t._id === rowId) ? { ...t, status: tx.status } : t));
                setFilteredTransactions(prev => (prev || []).map(t => (t.transaction_id === tx.transaction_id || t._id === rowId) ? { ...t, status: tx.status } : t));
                setEditTransaction(null);
            }
        } catch (e) {
            alert('Failed to update transaction status');
        }
    };

    const saveSupportStatus = async (ticketRowId) => {
        const ticket = (filteredSupport || []).find(t => t._id === ticketRowId);
        if (!ticket) return setEditSupport(null);
        try {
            const res = await axios.put(`${baseUrl}/updateTicketStatus`, {
                ticketId: ticketRowId,
                status: ticket.status
            });
            if (res.status === 200) {
                setSupportTicketsData(prev => (prev || []).map(t => t._id === ticketRowId ? { ...t, status: ticket.status } : t));
                setFilteredSupport(prev => (prev || []).map(t => t._id === ticketRowId ? { ...t, status: ticket.status } : t));
                setEditSupport(null);
            }
        } catch (e) {
            alert('Failed to update ticket status');
        }
    };

    // User filter: single select with toggle back to 'all'
    const handleUserStatusChangeFilter = (value) => setUserStatusFilter(value);

    // Transaction filters are split by group
    const handleTransactionStatusChangeFilter = (value) => setTransactionStatusFilter(value);
    const handleTransactionDateChangeFilter = (value) => setTransactionDateFilter(value);

    // Support filters split by group
    const handleSupportStatusChangeFilter = (value) => setSupportStatusFilter(value);
    const handleSupportPriorityChangeFilter = (value) => setSupportPriorityFilter(value);
    const handleSupportTypeChangeFilter = (value) => setSupportTypeFilter(value);

    // Export helpers
    const exportArrayToCSV = (filename, headers, rows) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(row => headers.map(h => {
                const val = row[h] ?? '';
                const escaped = String(val).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportUsers = () => {
        const headers = ['_id', 'companyName', 'email', 'establishedYear', 'location'];
        const rows = (filteredUsers || []).map(u => ({
            _id: u._id,
            companyName: u.companyName,
            email: u.email,
            establishedYear: u.establishedYear,
            location: u.location
        }));
        exportArrayToCSV('companies.csv', headers, rows);
    };

    const handleExportTransactions = () => {
        const headers = ['transaction_id', 'user_id', 'payment_method', 'price', 'created_at', 'status'];
        const rows = (filteredTransactions || []).map(t => ({
            transaction_id: t.transaction_id,
            user_id: t.user_id,
            payment_method: t.payment_method,
            price: t.price,
            created_at: t.created_at || t.createdAt,
            status: t.status
        }));
        exportArrayToCSV('transactions.csv', headers, rows);
    };

    const handleNotificationCategoryFilter = (value) => setNotificationCategoryFilter(value);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Blocked':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Inactive':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Successful':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Pending':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Failed':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'In Progress':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Completed':
                return 'bg-[#DCFCE7] text-[#15803D]';
            default:
                return 'bg-[#FEF9C3] text-[#CA8A04]';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Medium':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'High':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filteredSupport, setFilteredSupport] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getCompanyStatsAndData`);
            const stats = response.data.stats;
            setUsersStats(stats);
            const companiesData = response.data.CompanyData;
            setCompaniesData(companiesData);
            setFilteredUsers(companiesData);
            planManagementStats["Active Users"] = stats["Active Users"];
        } catch (error) {
            //console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getPaymentStatsAndData`);
            const paymentsData = response.data.PaymentData;
            setPaymentsData(paymentsData);
            const ps = response.data.PaymentStats || {};
            const { ["Revenue This Month"]: revenueThisMonth, ...otherStats } = ps;
            setPaymentsStats(otherStats);
            planManagementStats["Revenue This Month"] = revenueThisMonth ?? 0;
            setFilteredTransactions(paymentsData);
        } catch (error) {
            //console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getSupportStatsAndData`);
            const supportTicketsData = response.data.TicketData;
            setSupportTicketsData(supportTicketsData);
            const supportTicketsStats = response.data.TicketStats;
            setSupportTicketsStats(supportTicketsStats);
            setFilteredSupport(supportTicketsData);
        } catch (error) {
            //console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getNotificationsData`);
            const notificationsData = response.data;
            setNotificationsData(notificationsData);
            setFilteredNotifications(notificationsData);
        } catch (error) {
            //console.log("error", error);
        }
    }, []);

    useEffect(() => {
        //console.log("searchTerm", searchTerm);
        //console.log("companies", companiesData);
        if (searchTerm) {
            setFilteredUsers((companiesData || []).filter(user =>
                (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            ));
        } else {
            setFilteredUsers(companiesData);
        }
    }, [searchTerm]);

    useEffect(() => {
        //console.log("transactionSearchTerm", transactionSearchTerm);
        //console.log("payments", paymentsData);
        if (transactionSearchTerm) {
            setFilteredTransactions((paymentsData || []).filter(transaction => {
                const term = transactionSearchTerm.toLowerCase();
                return (
                    (transaction.transaction_id && transaction.transaction_id.toLowerCase().includes(term)) ||
                    (transaction.user_id && transaction.user_id.toLowerCase().includes(term)) ||
                    (transaction.payment_method && String(transaction.payment_method).toLowerCase().includes(term))
                );
            }));
        } else {
            setFilteredTransactions(paymentsData);
        }
    }, [transactionSearchTerm]);

    useEffect(() => {
        //console.log("supportSearchTerm", supportSearchTerm);
        //console.log("support", supportTicketsData);
        if (supportSearchTerm) {
            const term = supportSearchTerm.toLowerCase();
            setFilteredSupport((supportTicketsData || []).filter(ticket =>
                (ticket.type && ticket.type.toLowerCase().includes(term)) ||
                (ticket.subject && ticket.subject.toLowerCase().includes(term)) ||
                (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(term))
            ));
        } else {
            setFilteredSupport(supportTicketsData);
        }
    }, [supportSearchTerm]);

    useEffect(() => {
        //console.log("notificationSearchTerm", notificationSearchTerm);
        //console.log("notifications", notificationsData);

        if (notificationSearchTerm) {
            const term = notificationSearchTerm.toLowerCase();
            setFilteredNotifications((notificationsData || []).filter(notification =>
                (notification.title && notification.title.toLowerCase().includes(term)) ||
                (notification.description && notification.description.toLowerCase().includes(term)) ||
                (notification.type && notification.type.toLowerCase().includes(term))
            ));
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationSearchTerm]);

    useEffect(() => {
        const base = notificationsData || [];
        const filtered = base.filter(notification => {
            // time filter
            const time = new Date(notification.created_at || notification.createdAt || notification.time);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            const last14Days = new Date(today);
            last14Days.setDate(today.getDate() - 14);
            const last30Days = new Date(today);
            last30Days.setDate(today.getDate() - 30);

            let timeOk = true;
            if (notificationTimeFilter === 'today') timeOk = time.toDateString() === today.toDateString();
            else if (notificationTimeFilter === 'yesterday') timeOk = time.toDateString() === yesterday.toDateString();
            else if (notificationTimeFilter === 'last7Days') timeOk = time >= last7Days;
            else if (notificationTimeFilter === 'last14Days') timeOk = time >= last14Days;
            else if (notificationTimeFilter === 'last30Days') timeOk = time >= last30Days;

            // category filter
            const type = (notification.type || '').toLowerCase();
            const cat = (notificationCategoryFilter || 'All Categories').toLowerCase();
            const categoryOk = cat === 'all categories' ? true : type === cat;

            return timeOk && categoryOk;
        });
        setFilteredNotifications(filtered);
    }, [notificationsData, notificationTimeFilter, notificationCategoryFilter]);

    useEffect(() => {
        const base = companiesData || [];
        if (userStatusFilter === 'all') {
            setFilteredUsers(base);
        } else {
            setFilteredUsers(base.filter(u => (u.status || '').toLowerCase() === userStatusFilter));
        }
    }, [companiesData, userStatusFilter]);

    useEffect(() => {
        const base = paymentsData || [];
        const byStatus = transactionStatusFilter === 'all' ? base : base.filter(t => t.status === transactionStatusFilter);
        let result = byStatus;
        if (transactionDateFilter !== 'all') {
            const now = new Date();
            let since = null;
            if (transactionDateFilter === 'last7Days') since = new Date(now.setDate((new Date()).getDate() - 7));
            else if (transactionDateFilter === 'last15Days') since = new Date(now.setDate((new Date()).getDate() - 15));
            else if (transactionDateFilter === 'last30Days') since = new Date(now.setDate((new Date()).getDate() - 30));
            if (since) {
                result = result.filter(t => new Date(t.created_at || t.createdAt) >= since);
            }
        }
        setFilteredTransactions(result);
    }, [paymentsData, transactionStatusFilter, transactionDateFilter]);

    useEffect(() => {
        const base = supportTicketsData || [];
        const byStatus = supportStatusFilter === 'all' ? base : base.filter(t => (t.status || '').toLowerCase() === supportStatusFilter.toLowerCase());
        const byPriority = supportPriorityFilter === 'all' ? byStatus : byStatus.filter(t => (t.priority || '').toLowerCase() === supportPriorityFilter.toLowerCase());
        const byType = supportTypeFilter === 'all' ? byPriority : byPriority.filter(t => (t.type || '').toLowerCase() === supportTypeFilter.toLowerCase());
        setFilteredSupport(byType);
    }, [supportTicketsData, supportStatusFilter, supportPriorityFilter, supportTypeFilter]);

    // Removed duplicate notifications filter effect; combined above

    useEffect(() => {
        if (completedTickets) {
            setFilteredSupport(supportTicketsData.filter(support => support.status === 'Resolved'));
            //console.log("resolved", filteredSupport);
        } else {
            setFilteredSupport(supportTicketsData.filter(support => support.status !== 'Resolved'));
            //console.log("not resolved", filteredSupport);
        }
    }, [completedTickets, supportTicketsData]);

    const renderUserManagement = () => (
        <div className='h-full'>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {Object.keys(usersStats).map((key, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${key === "Total Proposals" ? "bg-[#E5E7EB]" : key === "Total Users" ? "bg-[#EBF4FF]" : key === "Active Users" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                            {key === "Total Proposals" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#4B5563]" /> : key === "Total Users" ? <MdOutlineGroup className="w-6 h-6 text-[#2563EB]" /> : key === "Active Users" ? <MdOutlineGroup className="w-6 h-6 text-[#22C55E]" /> : <MdOutlineGroup className="w-6 h-6 text-[#EF4444]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <p className="text-[16px] text-[#6B7280]">{key}</p>
                            <p className="text-[24px] font-semibold text-[#2563EB]">{usersStats[key]}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64 text-[#9CA3AF]"
                            />
                        </div>
                        <div className="relative">
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-colors w-full sm:w-auto"
                                onClick={() => setUserFilterModal(!userFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                            </button>

                            {userFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB] z-1000">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => setUserStatusFilter('all')}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="userStatusFilter" id="user_all" value="all"
                                            checked={userStatusFilter === 'all'}
                                            onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                        />
                                        <label htmlFor="user_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="active" value="active"
                                                checked={userStatusFilter === 'active'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="active">Active</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="blocked" value="blocked"
                                                checked={userStatusFilter === 'blocked'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="blocked">Blocked</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="inactive" value="inactive"
                                                checked={userStatusFilter === 'inactive'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="inactive">Inactive</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end">
                        <button onClick={handleExportUsers} className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg transition-colors w-full sm:w-auto">
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span className="text-[16px] text-white">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Name/Company
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Email ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Registration Date
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Last Active
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {user._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[16px] font-medium text-[#4B5563]">{user.companyName}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#111827]">
                                    {user.establishedYear}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#111827]">
                                    {user.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editUser === user._id ? (
                                        <select className="px-2 py-1 text-[12px] rounded-full"
                                            onChange={(e) => handleUserStatusChange(user._id, e.target.value)}
                                            value={user.status || 'Active'}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Blocked">Blocked</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-2 py-1 text-[12px] rounded-full ${getStatusColor(user.status || 'Active')}`}>
                                            {user.status || 'Active'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editUser === user._id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            onClick={() => saveUserStatus(user._id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditUser(user._id)}
                                        >
                                            <MdOutlineEdit className="w-5 h-5 text-[#2563EB]" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayments = () => (
        <div className='h-full'>
            {/* Payments Inner Tabs */}
            <div className="mb-6 py-4">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setPaymentsTab('payments')}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${paymentsTab === 'payments'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Payments
                    </button>
                    <button
                        onClick={() => setPaymentsTab('plan-management')}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${paymentsTab === 'plan-management'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Plan Management
                    </button>
                </nav>
            </div>

            {paymentsTab === 'payments' ? (
                <>
                    {/* Payments Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {Object.keys(paymentsStats).map((key, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 ${key === "Total Revenue" ? "bg-[#EBF4FF]" : key === "Successful Payments" ? "bg-[#F0FDF4]" : key === "Failed Payments" ? "bg-[#FEF2F2]" : key === "Revenue this month" ? "bg-[#EBF4FF]" : key === "Total Refunds" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                                    {key === "Total Revenue" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : key === "Successful Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#22C55E]" /> : key === "Failed Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#EF4444]" /> : key === "Revenue this month" ? <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" /> : key === "Total Refunds" ? <MdOutlinePaid className="w-6 h-6 text-[#22C55E]" /> : <MdOutlinePaid className="w-6 h-6 text-[#EF4444]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{key}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{paymentsStats[key]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Plan Management Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        {Object.keys(planManagementStats).map((key, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                                    {key === "Active Subscriptions" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{key}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{planManagementStats[key]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={transactionSearchTerm}
                                onChange={(e) => setTransactionSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors w-full sm:w-auto"
                                onClick={() => setTransactionFilterModal(!transactionFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span>Filter</span>
                            </button>
                            {transactionFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB] z-1000">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => { handleTransactionStatusChangeFilter('all'); handleTransactionDateChangeFilter('all'); }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionAll" id="txn_all" value="all"
                                            checked={transactionStatusFilter === 'all' && transactionDateFilter === 'all'}
                                            onChange={() => { handleTransactionStatusChangeFilter('all'); handleTransactionDateChangeFilter('all'); }}
                                        />
                                        <label htmlFor="txn_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="succeeded" value="succeeded"
                                                checked={transactionStatusFilter === 'succeeded'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="succeeded">Succeeded</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="pending" value="pending"
                                                checked={transactionStatusFilter === 'pending'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="pending">Pending</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="failed" value="failed"
                                                checked={transactionStatusFilter === 'failed'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="failed">Failed</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="refunded" value="refunded"
                                                checked={transactionStatusFilter === 'refunded'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="refunded">Refunded</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="pending_refund" value="pending refund"
                                                checked={transactionStatusFilter === 'pending refund'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="pending_refund">Pending Refund</label>
                                        </div>
                                    </div>
                                    {/* Date */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Date :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last7Days" value="last7Days"
                                                checked={transactionDateFilter === 'last7Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last7Days">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last15Days" value="last15Days"
                                                checked={transactionDateFilter === 'last15Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last15Days">Last 15 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last30Days" value="last30Days"
                                                checked={transactionDateFilter === 'last30Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last30Days">Last 30 Days</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end">
                        <button onClick={handleExportTransactions} className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors w-full sm:w-auto">
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Transaction ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Company/User
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Created
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredTransactions.length > 0 ? filteredTransactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.transaction_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.user_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.payment_method}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.created_at || transaction.createdAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editTransaction === transaction._id ? (
                                        <select className="px-4 py-2 text-[12px] rounded-lg border border-[#E5E7EB] focus:outline-none w-24"
                                            onChange={(e) => handleTransactionStatusChange(transaction.transaction_id, e.target.value)}
                                            value={transaction.status}
                                            defaultValue={transaction.status}
                                        >
                                            <option value="succeeded">Succeeded</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                            <option value="pending refund">Pending Refund</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-3 py-2 text-[12px] font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editTransaction === transaction._id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mr-2"
                                            onClick={() => saveTransactionStatus(transaction.transaction_id, transaction._id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditTransaction(transaction._id)}
                                        >
                                            <MdOutlineMoreVert className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className='h-full'>
            {/* Support Inner Tabs */}
            <div className="mb-6 py-4">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => { setSupportTab('active'); setCompletedTickets(false) }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${supportTab === 'active'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Active Tickets
                    </button>
                    <button
                        onClick={() => { setSupportTab('resolved'); setCompletedTickets(true) }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${supportTab === 'resolved'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Resolved Tickets
                    </button>
                </nav>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {Object.keys(supportTicketsStats).map((key, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                        <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                            {key === "Billing & Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : key === "Proposal Issues" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" /> : key === "Account & Access" ? <MdOutlinePerson className="w-6 h-6 text-[#2563EB]" /> : key === "Technical Errors" ? <MdOutlinePriorityHigh className="w-6 h-6 text-[#2563EB]" /> : key === "Feature Requests" ? <MdOutlinePayment className="w-6 h-6 text-[#2563EB]" /> : <MdOutlineMoreVert className="w-6 h-6 text-[#2563EB]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <span className="text-[16px] font-medium text-[#4B5563]">{key}</span>
                            <span className="text-[12px] font-medium text-[#4B5563]">{supportTicketsStats[key]}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={supportSearchTerm}
                                onChange={(e) => setSupportSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors w-full sm:w-auto"
                                onClick={() => setSupportFilterModal(!supportFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span>Filter</span>
                            </button>

                            {supportFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => { handleSupportStatusChangeFilter('all'); handleSupportPriorityChangeFilter('all'); handleSupportTypeChangeFilter('all'); }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportAll" id="support_all" value="all"
                                            checked={supportStatusFilter === 'all' && supportPriorityFilter === 'all' && supportTypeFilter === 'all'}
                                            onChange={() => { handleSupportStatusChangeFilter('all'); handleSupportPriorityChangeFilter('all'); handleSupportTypeChangeFilter('all'); }}
                                        />
                                        <label htmlFor="support_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportStatusFilter" id="active" value="active"
                                                checked={supportStatusFilter === 'active'}
                                                onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="active">Active</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportStatusFilter" id="resolved" value="resolved"
                                                checked={supportStatusFilter === 'resolved'}
                                                onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="resolved">Resolved</label>
                                        </div>
                                    </div>
                                    {/* Priority */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Priority :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="low" value="low"
                                                checked={supportPriorityFilter === 'low'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="low">Low</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="medium" value="medium"
                                                checked={supportPriorityFilter === 'medium'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="medium">Medium</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="high" value="high"
                                                checked={supportPriorityFilter === 'high'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="high">High</label>
                                        </div>
                                    </div>
                                    {/* Type */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Type :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="billingPayments" value="billing & payments"
                                                checked={supportTypeFilter === 'billing & payments'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="billingPayments">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="technicalErrors" value="technical errors"
                                                checked={supportTypeFilter === 'technical errors'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="technicalErrors">Technical Errors</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="featureRequests" value="feature requests"
                                                checked={supportTypeFilter === 'feature requests'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="featureRequests">Feature Requests</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="accountAccess" value="account & access"
                                                checked={supportTypeFilter === 'account & access'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="accountAccess">Account & Access</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="proposalIssues" value="proposal issues"
                                                checked={supportTypeFilter === 'proposal issues'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="proposalIssues">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="others" value="others"
                                                checked={supportTypeFilter === 'others'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="others">Others</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-x-auto">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ticket ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredSupport.length > 0 ? filteredSupport.map((ticket, index) => (
                            <tr key={index} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {ticket.ticket_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.user_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.created_at}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editSupport === ticket._id ? (
                                        <select className="px-4 py-2 text-[12px] rounded-lg border border-[#E5E7EB] focus:outline-none w-24"
                                            onChange={(e) => handleSupportStatusChange(ticket._id, e.target.value)}
                                            value={ticket.status}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editSupport === ticket._id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mr-2"
                                            onClick={() => saveSupportStatus(ticket._id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditSupport(ticket._id)}
                                        >
                                            <MdOutlineMoreVert className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                    No tickets found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderNotifications = () => {
        const getNotificationIcon = (icon) => {
            switch (icon) {
                case 'User':
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
                case 'Payment':
                    return <MdOutlineShoppingBag className="w-5 h-5" />;
                case 'Support':
                    return <MdOutlineHeadphones className="w-5 h-5" />;
                case 'Subscription':
                    return <MdOutlineMoney className="w-5 h-5" />;
                default:
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
            }
        };

        return (
            <div className="h-full">
                {/* Filters and Search */}
                <div className="pb-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="relative">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
                                    onClick={() => setNotificationTimeFilterModal(!notificationTimeFilterModal)}
                                >
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                    <span>{notificationTimeFilter || 'All Time'}</span>
                                </button>

                                {notificationTimeFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Time</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline"
                                                onClick={() => setNotificationTimeFilter('all')}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="allTime" value="All Time"
                                                checked={notificationTimeFilter === 'All Time'}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="allTime">All Time</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="today" value="today"
                                                checked={notificationTimeFilter === 'today'}
                                                onClick={(e) => { if (notificationTimeFilter === e.target.value) setNotificationTimeFilter('All Time'); }}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="today">Today</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="yesterday" value="yesterday"
                                                checked={notificationTimeFilter === 'yesterday'}
                                                onClick={(e) => { if (notificationTimeFilter === e.target.value) setNotificationTimeFilter('All Time'); }}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="yesterday">Yesterday</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last7Days" value="last7Days"
                                                checked={notificationTimeFilter === 'last7Days'}
                                                onClick={(e) => { if (notificationTimeFilter === e.target.value) setNotificationTimeFilter('All Time'); }}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last7Days">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last14Days" value="last14Days"
                                                checked={notificationTimeFilter === 'last14Days'}
                                                onClick={(e) => { if (notificationTimeFilter === e.target.value) setNotificationTimeFilter('All Time'); }}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last14Days">Last 14 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last30Days" value="last30Days"
                                                checked={notificationTimeFilter === 'last30Days'}
                                                onClick={(e) => { if (notificationTimeFilter === e.target.value) setNotificationTimeFilter('All Time'); }}
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last30Days">Last 30 Days</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
                                    onClick={() => setNotificationCategoryFilterModal(!notificationCategoryFilterModal)}
                                >
                                    <span>{notificationCategoryFilter || 'All Categories'}</span>
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                </button>

                                {notificationCategoryFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Category</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline"
                                                onClick={() => handleNotificationCategoryFilter('all')}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="allCategories" value="All Categories"
                                                checked={notificationCategoryFilter === 'All Categories'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="allCategories">All Categories</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="accountAccess" value="account access"
                                                checked={notificationCategoryFilter === 'account access'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="accountAccess">Account & Access</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="billingPayments" value="billing & payments"
                                                checked={notificationCategoryFilter === 'billing & payments'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="billingPayments">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="technicalErrors" value="technical errors"
                                                checked={notificationCategoryFilter === 'technical errors'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="technicalErrors">Technical Errors</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="featureRequests" value="feature requests"
                                                checked={notificationCategoryFilter === 'feature requests'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="featureRequests">Feature Requests</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="proposalIssues" value="proposal issues"
                                                checked={notificationCategoryFilter === 'proposal issues'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="proposalIssues">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="others" value="others"
                                                checked={notificationCategoryFilter === 'others'}
                                                onClick={(e) => { if (notificationCategoryFilter === e.target.value) handleNotificationCategoryFilter('All Categories'); }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="others">Others</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdOutlineSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                value={notificationSearchTerm}
                                onChange={(e) => setNotificationSearchTerm(e.target.value)}
                                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? filteredNotifications.map((item) => (
                    <div key={item.id} className="bg-white p-4 transition-colors border border-[#E5E7EB] rounded-lg mb-4">
                        <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    {getNotificationIcon(item.category)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <p className="text-sm text-gray-500">{item.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                        No notifications found
                    </div>
                )}
            </div>
        );
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Top Header Bar */}
            <div className="bg-white border-b border-[#0000001A] px-8 md:px-12 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        {/* Mobile Menu Button - Only visible on small screens */}
                        <button
                            className="lg:hidden p-2 transition-colors"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                        </button>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-[#2563eb] font-bold text-sm">LOGO</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 transition-colors relative"
                            onClick={() => setActiveTab('notifications')}
                        >
                            <MdOutlineNotifications className="relative w-6 h-6 text-[#4B5563]" />
                            {notificationsData.length > 0 && (
                                <span className="absolute top-[1px] right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <MdOutlinePerson className="w-5 h-5 text-white" />
                        </div>
                        {showProfile && (
                            <div className="absolute top-16 right-0 w-64 bg-[#F8F9FA] rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000">
                                <button className="w-full text-left rounded-lg p-2 flex items-center space-x-3 transition-colors text-[#4B5563]"
                                    onClick={() => navigate('/change-password')}
                                >
                                    <MdOutlineLock className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Change Password</span>
                                </button>
                                <button className="w-full text-left rounded-lg p-2 flex items-center space-x-3 transition-colors text-[#4B5563]"
                                    onClick={() => handleLogout()}
                                >
                                    <MdOutlineLogout className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Only visible on small screens */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                                <button
                                    className="p-2 transition-colors"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <nav className="space-y-2">
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'user-management'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('user-management');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineManageAccounts className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">User Management</span>
                                </button>
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'payments'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('payments');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlinePayments className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Payments & Subscriptions</span>
                                </button>
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'support'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('support');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineHeadsetMic className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Support</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar - Hidden on small screens, visible on large screens */}
                <div className="hidden lg:block w-64 bg-white border-r border-[#0000001A] flex-shrink-0">
                    <div className="p-4">
                        <nav className="space-y-2">
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'user-management'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('user-management')}
                            >
                                <MdOutlineManageAccounts className="w-4 h-4" />
                                <span className="text-[16px] font-medium">User Management</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'payments'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('payments')}
                            >
                                <MdOutlinePayments className="w-4 h-4" />
                                <span className="text-[16px] font-medium">Payments & Subscriptions</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'support'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('support')}
                            >
                                <MdOutlineHeadsetMic className="w-4 h-4" />
                                <span className="text-[16px] font-medium">Support</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 min-h-full">
                            {/* Content based on active tab */}
                            {activeTab === 'user-management' && renderUserManagement()}
                            {activeTab === 'payments' && renderPayments()}
                            {activeTab === 'support' && renderSupport()}
                            {activeTab === 'notifications' && renderNotifications()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;
